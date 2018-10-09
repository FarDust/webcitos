const KoaRouter = require('koa-router');
 const router = new KoaRouter();

 router.param('id', async (id, ctx, next) => {
   const request = await ctx.orm.request.findById(ctx.params.id);
   ctx.assert(request, 404);
   ctx.state.request = request;
   return next();
 });

 router.get('requests', '/', async (ctx) => {
  if (ctx.state.currentUser) {
   const requests = await ctx.orm.request.findAll();
   return ctx.render('requests/index', {
     requests,
     newrequestPath: ctx.router.url('requests-new'),
     getShowPath: request => ctx.router.url('requests-show', request.id),
     getEditPath: request => ctx.router.url('requests-edit', request.id),
     getDestroyPath: request => ctx.router.url('requests-destroy', request.id),
   });
  }else{
  ctx.flashMessage.notice = 'Please, log in to access these features';
  ctx.redirect('/');
  }
 });

 router.get('requests-all', '/publications/:pid/', async (ctx) => {
  if (ctx.state.currentUser) {
    const publication = await ctx.orm.publication.findById(ctx.params.pid);
   const requests = await publication.getRequests();
   return ctx.render('requests/index', {
     requests,
     newrequestPath: ctx.router.url('requests-new', ctx.params.pid),
     getShowPath: request => ctx.router.url('requests-show', request.id),
     getEditPath: request => ctx.router.url('requests-edit', request.id),
     getDestroyPath: request => ctx.router.url('requests-destroy', request.id),
   });
  }else{
  ctx.flashMessage.notice = 'Please, log in to access these features';
  ctx.redirect('/');
  }
 });

 router.get('requests-new', '/publications/:pid/new', (ctx) => {
  if (ctx.state.currentUser) {
  return ctx.render('requests/new',
   {
     request: ctx.orm.request.build(),
     publication_id: ctx.params.pid,
     user_id: ctx.state.currentUser.id,
     submitPath: ctx.router.url('requests-create'),
   },)
  }else{
  ctx.flashMessage.notice = 'Please, log in to access these features';
  ctx.redirect('/');
  }
});

 router.post('requests-create', '/', async (ctx) => {
  await ctx.orm.request.create(ctx.request.body);
  ctx.redirect(ctx.router.url('publications-show', {id: ctx.request.body.publication_id}));
 });

router.get('requests-show', '/:id', (ctx) => {
  if (ctx.state.currentUser) {
  return ctx.render('requests/show',
  {
    name: 'request',
    ignore: ['createdAt', 'updatedAt', 'id'],
    state: JSON.parse(JSON.stringify(ctx.state.request)),
  },)
  }else{
  ctx.flashMessage.notice = 'Please, log in to access these features';
  ctx.redirect('/');
  }
});

 router.get('requests-edit', '/:id/edit', (ctx) => {
  const { request } = ctx.state;
  if (ctx.state.currentUser) {
   return ctx.render(
     'requests/edit',
     {
       request,
       submitPath: ctx.router.url('requests-update', request.id),
     },
   );
  }else{
  ctx.flashMessage.notice = 'Please, log in to access these features';
  ctx.redirect('/');
  }
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
