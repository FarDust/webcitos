const KoaRouter = require('koa-router');
const router = new KoaRouter();

router.param('id', async (id, ctx, next) => {
  const trade = await ctx.orm.trade.findById(ctx.params.id);
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
    getShowPath: trade => ctx.router.url('trades-show', trade.id),
    getEditPath: trade => ctx.router.url('trades-edit', trade.id),
    getDestroyPath: trade => ctx.router.url('trades-destroy', trade.id),
  });
  }else{
  ctx.flashMessage.notice = 'Please, log in to access these features';
  ctx.redirect('/');
  }
});

router.get('trades-new', '/new', (ctx) => {
  if (ctx.state.currentUser) {
  return ctx.render('trades/new',
  {
    trade: ctx.orm.trade.build(),
    submitPath: ctx.router.url('trades-create'),
  },)
  }else{
  ctx.flashMessage.notice = 'Please, log in to access these features';
  ctx.redirect('/');
  }
});

router.post('trades-create', '/', async (ctx) => {
  await ctx.orm.trade.create(ctx.request.body);
  ctx.redirect(ctx.router.url('trades'));
});

router.get('trades-show', '/:id', (ctx) => {
  if (ctx.state.currentUser) {
  return ctx.render('trades/show',
  {
    name: 'trade',
    ignore: ['createdAt', 'updatedAt', 'id'],
    state: JSON.parse(JSON.stringify(ctx.state.trade)),
  },)
  }else{
  ctx.flashMessage.notice = 'Please, log in to access these features';
  ctx.redirect('/'); 
  }
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
  }else{
  ctx.flashMessage.notice = 'Please, log in to access these features';
  ctx.redirect('/');  
  }
});

router.patch('trades-update', '/:id', async (ctx) => {
   const { trade } = ctx.state;
   try {
     await trade.update(
       ctx.request.body,
       { fields: ['id_request', 'state'] },
     );
     if (ctx.request.body.state == 'concreted') {
      const request = await ctx.orm.request.findById(trade.id_request);
      const publication = await ctx.orm.publication.findById(request.publication_id);
      await publication.update({state: 'inventory'}, { fields: ['state'] });
     }
     ctx.redirect(ctx.router.url('trades-show', trade.id));
   } catch (error) {
     if (!isValidationError(error)) throw error;
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