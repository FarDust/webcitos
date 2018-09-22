const KoaRouter = require('koa-router');
 const router = new KoaRouter();

 router.param('id', async (id, ctx, next) => {
   const request = await ctx.orm.request.findById(ctx.params.id);
   ctx.assert(request, 404);
   ctx.state.request = request;
   return next();
 });

 router.get('requests', '/', async (ctx) => {
   const requests = await ctx.orm.request.findAll();
   return ctx.render('requests/index', {
     requests,
     newrequestPath: ctx.router.url('requests-new'),
     getShowPath: request => ctx.router.url('requests-show', request.id),
     getEditPath: request => ctx.router.url('requests-edit', request.id),
     getDestroyPath: request => ctx.router.url('requests-destroy', request.id),
   });
 });

 router.get('requests-new', '/new', ctx => ctx.render(
   'requests/new',
   {
     request: ctx.orm.request.build(),
     submitPath: ctx.router.url('requests-create'),
   },
 ));

 router.post('requests-create', '/', async (ctx) => {
   const request = ctx.orm.request.build(ctx.request.body);
   try {
     await request.save(ctx.request.body);
     ctx.redirect(ctx.router.url('requests'));
   } catch (error) {
     if (!isValidationError(error)) throw error;
     await ctx.render('requests/new', {
       request,
       errors: getFirstErrors(error),
       submitPath: ctx.router.url('requests-create'),
     });
   }
 });

 router.get('requests-show', '/:id', async (ctx) => {
   ctx.body = ctx.state.request;
 });

 router.get('requests-edit', '/:id/edit', (ctx) => {
   const { request } = ctx.state;
   return ctx.render(
     'requests/edit',
     {
       request,
       submitPath: ctx.router.url('requests-update', request.id),
     },
   );
 });

 router.patch('requests-update', '/:id', async (ctx) => {
   const { request } = ctx.state;
   try {
     await request.update(
       ctx.request.body,
       { fields: ['message'] },
     );
     ctx.redirect(ctx.router.url('requests-show', request.id));
   } catch (error) {
     if (!isValidationError(error)) throw error;
     await ctx.render('requests/edit', {
       request,
       errors: getFirstErrors(error),
       submitPath: ctx.router.url('requests-update', request.id),
     });
   }
 });

 router.delete('requests-destroy', '/:id', async (ctx) => {
   await ctx.state.request.destroy();
   ctx.redirect(ctx.router.url('requests'));
 });

 module.exports = router;
