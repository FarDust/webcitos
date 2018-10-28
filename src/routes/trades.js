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
      // dejar en inventory la publicacion
      await publication.update({ state: 'inventory' }, { fields: ['state'] });
      // dejar en inventory la otra publicacion
      if (request.item_offered_id) {
        const item = await ctx.orm.item.findById(request.item_offered_id);
        const item_publication = await item.getPublication();
        await item_publication.update({ state: 'inventory' }, { fields: ['state'] });
      }
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
