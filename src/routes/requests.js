const KoaRouter = require('koa-router');
 const router = new KoaRouter();

 router.get('requests', '/', async (ctx) => {
   ctx.body = await ctx.orm.request.findAll();

});

router.post('requests-create', '/', async (ctx) => {
  await ctx.orm.request.create(ctx.request.body);
  ctx.redirect(ctx.router.url('requests'));
});

 router.get('requests-show', '/:id', async (ctx) => {
  const request = await ctx.orm.request.findById(ctx.params.id);
  ctx.assert(request, 404);
  ctx.body = request;
});
 router.patch('requests-update', '/:id', async (ctx) => {
  const request = await ctx.orm.request.findById(ctx.params.id);
  ctx.assert(request, 404);
  ctx.body = await request.update(
    ctx.request.body,
    { fields: ['title', 'description', 'state'] },
  );
});
 router.delete('requests-destroy', '/:id', async (ctx) => {
  const request = await ctx.orm.request.findById(ctx.params.id);
  ctx.assert(request, 404);
  await request.destroy();
  ctx.redirect(ctx.router.url('requests'));
});


 module.exports = router;
