const KoaRouter = require('koa-router');
 const router = new KoaRouter();

 router.get('items', '/', async (ctx) => {
   ctx.body = await ctx.orm.item.findAll();

});

router.post('items-create', '/', async (ctx) => {
  await ctx.orm.item.create(ctx.request.body);
  ctx.redirect(ctx.router.url('items'));
});

 router.get('items-show', '/:id', async (ctx) => {
  const item = await ctx.orm.item.findById(ctx.params.id);
  ctx.assert(item, 404);
  ctx.body = item;
});
 router.patch('items-update', '/:id', async (ctx) => {
  const item = await ctx.orm.item.findById(ctx.params.id);
  ctx.assert(item, 404);
  ctx.body = await item.update(
    ctx.request.body,
    { fields: ['model', 'brand', 'additional', 'state', 'category', 'screen_size'] },
  );
});
 router.delete('items-destroy', '/:id', async (ctx) => {
  const item = await ctx.orm.item.findById(ctx.params.id);
  ctx.assert(item, 404);
  await item.destroy();
  ctx.redirect(ctx.router.url('items'));
});


 module.exports = router;
