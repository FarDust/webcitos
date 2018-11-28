const KoaRouter = require('koa-router');
const Sequelize = require('sequelize');
const { getTradeInfo } = require('./general_info')

const { isValidationError, getFirstErrors } = require('../lib/models/validation-error');

const router = new KoaRouter();

router.param('id', async (id, ctx, next) => {
  const trade = await getTradeInfo(ctx.params.id, ctx);
  ctx.assert(trade, 404);
  ctx.state.trade = trade;
  return next();
});

router.get('trades', '/', async (ctx) => {
  if (ctx.state.currentUser) {
    const trades = await ctx.orm.trade.findAll(); /* Aqui tenemos que filtrar por usuario */
    return ctx.render('trades/index', {
      trades,
      newTradePath: ctx.router.url('trades-new'),
      getShowPath: trade => ctx.router.url('trades-show', {'tid':trade.id}),
      getEditPath: trade => ctx.router.url('trades-edit', trade.id),
      getDestroyPath: trade => ctx.router.url('trades-destroy', trade.id),
    });
  }
  ctx.flashMessage.notice = 'Please, log in to access these features';
  ctx.redirect('/');
});

router.get('trades-new', 'new', (ctx) => {
  if (ctx.state.currentUser) {
    return ctx.render('trades/new',
      {
        trade: ctx.orm.trade.build(),
        submitPath: ctx.router.url('trades-create'),
      });
  }
  ctx.flashMessage.notice = 'Please, log in to access these features';
  ctx.redirect('/');
});

router.post('trades-create', '/:id_request/:state', async (ctx) => {
  const request = await ctx.orm.request.findById(ctx.params.id_request);
  const trade = await request.getTrade();
  if (trade) {
    ctx.flashMessage.notice = 'It already has a trade in process!';
    ctx.redirect(ctx.router.url('requests-mine'));
  } else {
    const publication = await ctx.orm.publication.findById(request.publication_id);

    if (publication.state === 'pendent') {
      ctx.flashMessage.notice = 'Another request already has a trade in process!';
      ctx.redirect(ctx.router.url('requests-mine'));
    } else {
      await ctx.orm.trade.create(ctx.request.body);
      // Pongo mi publicacion en pendiente
      await publication.update({ state: 'pendent' }, { fields: ['state'] });
      // Pongo la publicacion del otro en pendiente
      const other_item = await ctx.orm.item.findById(request.item_offered_id);
      if (other_item) {
        const other_publication = await other_item.getPublication();
        await other_publication.update({ state: 'pendent' }, { fields: ['state'] });
      }
      ctx.redirect(ctx.router.url('users-show', { id: ctx.state.currentUser.id }));
    }
  }
});

router.get('trades-show', '/:tid', async (ctx) => {
  if (ctx.state.currentUser) {
    ctx.state.trade = await getTradeInfo(ctx.params.tid, ctx);
    return ctx.render('trades/show',
      {
        trade: ctx.state.trade,
        getEditPath: trade => ctx.router.url('trades-update', trade.id),
        getReviewNewUrl: trade => ctx.router.url('reviews-new', { tid: trade.id }),
      });
  }
  ctx.flashMessage.notice = 'Please, log in to access these features';
  ctx.redirect('/');
});

router.get('trades-edit', '/:id/edit', (ctx) => {
  const { trade } = ctx.state;
  if (ctx.state.currentUser) {
    return ctx.render(
      'trades/edit',
      {
        trade,
        submitPath: ctx.router.url('trades-update', trade.id),
      },
    );
  }
  ctx.flashMessage.notice = 'Please, log in to access these features';
  ctx.redirect('/');

  ctx.flashMessage.notice = 'Please, log in to access these features';
  ctx.redirect('/');
});

router.patch('trades-update', '/:id', async (ctx) => {
  const { trade } = ctx.state;
  try {
    if (ctx.session.currentUserId === trade.receptor.id){
      await trade.update(
        ctx.request.body,
        { fields: ['state'] },
      );
    }
    const request = await ctx.orm.request.findById(trade.id_request);
    const publication = await ctx.orm.publication.findById(request.publication_id);
    if (ctx.request.body.state == 'concreted') {
      // dejar en traded la publicacion y cambiar dueño
      await publication.update({ state: 'traded'}, { fields: ['state'] });

      // Se crea una nueva publicacion con los datos cambiados, así no hay
      // problemas con el request
      const new_pub1 = await ctx.orm.publication.create({
        'title': publication.title,
        'description': publication.description,
        'state': 'inventory',
        'userID': trade.receptor.id,
      });
      // Se crea un item igual pero con la referencia a esta publicación
      const item_pub1 = await publication.getItem();
      await ctx.orm.item.create({
        model: item_pub1.model,
        brand: item_pub1.brand,
        screenSize: item_pub1.screenSize,
        category: item_pub1.category,
        state: item_pub1.item_state,
        aditional: item_pub1.aditional,
        image: item_pub1.image,
        publication_id: new_pub1.id,
      })


      // dejar en inventory la otra publicacion y cambiar dueño
      if (request.item_offered_id) {
        const item = await ctx.orm.item.findById(request.item_offered_id);
        const item_publication = await item.getPublication();
        await item_publication.update({ state: 'traded'}, { fields: ['state'] });

        // Se crea una nueva publicacion con los datos cambiados, así no hay
        // problemas con el request
        const new_pub2 = await ctx.orm.publication.create({
          'title': item_publication.title,
          'description': item_publication.description,
          'state': 'inventory',
          'userID': trade.emmiter.id,
        });
        // Se crea un item igual pero con la referencia a esta publicación
        await ctx.orm.item.create({
          model: item.model,
          brand: item.brand,
          screenSize: item.screenSize,
          category: item.category,
          state: item.item_state,
          aditional: item.aditional,
          image: item.image,
          publication_id: new_pub2.id,
        })

        // Se destruyen los requests que ya no sirven
        await item_publication.getRequests().then((requests) => {
          requests.forEach(req => {
            req.destroy();
          })
        });
      }

      // Se destruyen los requests que ya no sirven
      await publication.getRequests().then((requests) => {
        requests.forEach(req => {
          if (req.id !== request.id) {
            req.destroy();
          }
        })
      });


    } else if (ctx.request.body.state == 'not_concreted') {
      if (request.item_offered_id) {
        // dejar en el estado anterior la publicacion
        await publication.update({ state: 'exchange' }, { fields: ['state'] });
        // dejar en el estado anterior la otra publicacion
        const item = await ctx.orm.item.findById(request.item_offered_id);
        const item_publication = await item.getPublication();
        await item_publication.update({ state: 'exchange' }, { fields: ['state'] });
      } else {
        // dejar en el estado anterior la publicacion
        await publication.update({ state: 'gift' }, { fields: ['state'] });
      }
    }
    ctx.redirect(ctx.router.url('trades-show', {'tid':trade.id}));
  } catch (error) {
    console.log('ERROR', error);
    if (!isValidationError(error)) {
      console.log('ERROR', error);
      throw error;
    }
    await ctx.render('trades/edit', {
      trade,
      errors: getFirstErrors(error),
      submitPath: ctx.router.url('trades-update', trade.id),
    });
  }
});

router.delete('trades-destroy', '/:id', async (ctx) => {
  await ctx.state.trade.destroy();
  ctx.redirect(ctx.router.url('trades'));
});

module.exports = router;
