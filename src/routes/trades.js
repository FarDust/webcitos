const KoaRouter = require('koa-router');
const router = new KoaRouter();

router.param('id', async (id, ctx, next) => {
  const trade = await ctx.orm.trade.findById(ctx.params.id);
  ctx.assert(trade, 404);
  ctx.state.trade = trade;
  return next();
});

router.get('trades', '/', async (ctx) => {
  const trades = await ctx.orm.trade.findAll();
  return ctx.render('trades/index', {
    trades,
    newTradePath: ctx.router.url('trades-new'),
    getShowPath: trade => ctx.router.url('trades-show', trade.id),
    getEditPath: trade => ctx.router.url('trades-edit', trade.id),
    getDestroyPath: trade => ctx.router.url('trades-destroy', trade.id),
  });
});

router.get('trades-new', '/new', ctx => ctx.render(
  'trades/new',
  {
    trade: ctx.orm.trade.build(),
    submitPath: ctx.router.url('trades-create'),
  },
));

router.post('trades-create', '/', async (ctx) => {
  await ctx.orm.trade.create(ctx.request.body);
  ctx.redirect(ctx.router.url('trades'));
});

router.get('trades-show', '/:id', ctx => ctx.render(
  'trades/show',
  {
    name: 'trade',
    ignore: ['createdAt', 'updatedAt', 'id'],
    state: JSON.parse(JSON.stringify(ctx.state.trade)),
  },
));

router.get('trades-edit', '/:id/edit', (ctx) => {
  const { trade } = ctx.state;
  return ctx.render(
    'trades/edit',
    {
      trade,
      submitPath: ctx.router.url('trades-update', trade.id),
    },
  );
});

router.patch('trades-update', '/:id', async (ctx) => {
  ctx.body = await ctx.state.trade.update(
    ctx.request.body,
    { fields: ['id_request', 'state'] },
  );
});

router.delete('trades-destroy', '/:id', async (ctx) => {
  await ctx.state.trade.destroy();
  ctx.redirect(ctx.router.url('trades'));
});

module.exports = router;