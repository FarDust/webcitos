const KoaRouter = require('koa-router');
 const router = new KoaRouter();

 router.param('id', async (id, ctx, next) => {
   const review = await ctx.orm.review.findById(ctx.params.id);
   ctx.assert(review, 404);
   ctx.state.review = review;
   return next();
 });

 router.get('reviews', '/', async (ctx) => {
   const reviews = await ctx.orm.review.findAll();
   return ctx.render('reviews/index', {
     reviews,
     newreviewPath: ctx.router.url('reviews-new'),
     getShowPath: review => ctx.router.url('reviews-show', review.id),
     getEditPath: review => ctx.router.url('reviews-edit', review.id),
     getDestroyPath: review => ctx.router.url('reviews-destroy', review.id),
   });
 });

 router.get('reviews-new', '/new', ctx => ctx.render(
   'reviews/new',
   {
     review: ctx.orm.review.build(),
     submitPath: ctx.router.url('reviews-create'),
   },
 ));

 router.post('reviews-create', '/', async (ctx) => {
  await ctx.orm.review.create(ctx.request.body);
  ctx.redirect(ctx.router.url('reviews'));
 });

router.get('reviews-show', '/:id', ctx => ctx.render(
  'reviews/show',
  {
    name: 'review',
    ignore: ['createdAt', 'updatedAt', 'id'],
    state: JSON.parse(JSON.stringify(ctx.state.review)),
  },
));

 router.get('reviews-edit', '/:id/edit', (ctx) => {
   const { review } = ctx.state;
   return ctx.render(
     'reviews/edit',
     {
       review,
       submitPath: ctx.router.url('reviews-update', review.id),
     },
   );
 });

 router.patch('reviews-update', '/:id', async (ctx) => {
   const { review } = ctx.state;
   try {
     await review.update(
       ctx.request.body,
       { fields: ['message'] },
     );
     ctx.redirect(ctx.router.url('reviews-show', review.id));
   } catch (error) {
     if (!isValidationError(error)) throw error;
     await ctx.render('reviews/edit', {
       review,
       errors: getFirstErrors(error),
       submitPath: ctx.router.url('reviews-update', review.id),
     });
   }
 });

 router.delete('reviews-destroy', '/:id', async (ctx) => {
   await ctx.state.review.destroy();
   ctx.redirect(ctx.router.url('reviews'));
 });

 module.exports = router;
