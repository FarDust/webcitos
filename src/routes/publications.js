const KoaRouter = require('koa-router');
 const router = new KoaRouter();

 router.param('id', async (id, ctx, next) => {
   const publication = await ctx.orm.publication.findById(ctx.params.id);
   ctx.assert(publication, 404);
   ctx.state.publication = publication;
   return next();
 });

 router.get('publications', '/', async (ctx) => {
   const publications = await ctx.orm.publication.findAll();
   return ctx.render('publications/index', {
     publications,
     newpublicationPath: ctx.router.url('publications-new'),
     getShowPath: publication => ctx.router.url('publications-show', publication.id),
     getEditPath: publication => ctx.router.url('publications-edit', publication.id),
     getDestroyPath: publication => ctx.router.url('publications-destroy', publication.id),
   });
 });

 router.get('publications-new', '/new', ctx => ctx.render(
   'publications/new',
   {
     publication: ctx.orm.publication.build(),
     submitPath: ctx.router.url('publications-create'),
   },
 ));

 router.post('publications-create', '/', async (ctx) => {
  await ctx.orm.publication.create(ctx.request.body);
  ctx.redirect(ctx.router.url('publications'));
 });

 router.get('publications-show', '/:id', ctx => ctx.render(
  'publications/show',
  {
    name: 'publication',
    ignore: ['createdAt', 'updatedAt', 'id'],
    state: JSON.parse(JSON.stringify(ctx.state.publication)),
  },
));

 router.get('publications-edit', '/:id/edit', (ctx) => {
   const { publication } = ctx.state;
   return ctx.render(
     'publications/edit',
     {
       publication,
       submitPath: ctx.router.url('publications-update', publication.id),
     },
   );
 });

 router.patch('publications-update', '/:id', async (ctx) => {
   const { publication } = ctx.state;
   try {
     await publication.update(
       ctx.request.body,
       { fields: ['title', 'description', 'state'] },
     );
     ctx.redirect(ctx.router.url('publications-show', publication.id));
   } catch (error) {
     if (!isValidationError(error)) throw error;
     await ctx.render('publications/edit', {
       publication,
       errors: getFirstErrors(error),
       submitPath: ctx.router.url('publications-update', publication.id),
     });
   }
 });

 router.delete('publications-destroy', '/:id', async (ctx) => {
   await ctx.state.publication.destroy();
   ctx.redirect(ctx.router.url('publications'));
 });

 module.exports = router;