const KoaRouter = require('koa-router');
 const router = new KoaRouter();

 router.get('publications', '/', async (ctx) => {
   ctx.body = await ctx.orm.publication.findAll();

});

router.post('publications-create', '/', async (ctx) => {
  await ctx.orm.publication.create(ctx.request.body);
  ctx.redirect(ctx.router.url('publications'));
});

 router.get('publications-show', '/:id', async (ctx) => {
  const publication = await ctx.orm.publication.findById(ctx.params.id);
  ctx.assert(publication, 404);
  ctx.body = publication;
});
 router.patch('publications-update', '/:id', async (ctx) => {
  const publication = await ctx.orm.publication.findById(ctx.params.id);
  ctx.assert(publication, 404);
  ctx.body = await publication.update(
    ctx.request.body,
    { fields: ['title', 'description', 'state'] },
  );
});
 router.delete('publications-destroy', '/:id', async (ctx) => {
  const publication = await ctx.orm.publication.findById(ctx.params.id);
  ctx.assert(publication, 404);
  await publication.destroy();
  ctx.redirect(ctx.router.url('publications'));
});


 module.exports = router;
