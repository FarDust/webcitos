const KoaRouter = require('koa-router');

// Callbacks 

async function reviewsIndexRendererCallback(ctx) {
  const reviews = await ctx.orm.review.findAll();
  return ctx.render('reviews/index', {
    reviews,
    newreviewPath: ctx.router.url('reviews-new'),
    getShowPath: review => ctx.router.url('reviews-show', review.id),
    getEditPath: review => ctx.router.url('reviews-edit', review.id),
    getDestroyPath: review => ctx.router.url('reviews-destroy', review.id),
  });
}

async function reviewsCreateCallback(ctx) {
  await ctx.orm.review.create(ctx.request.body);
  ctx.redirect(ctx.router.url('reviews'));
}

async function reviewsShowCallback(ctx) {
  const review = await ctx.orm.review.findById(ctx.params.id);
  ctx.assert(review, 404);
  ctx.body = review;
}

async function reviewsUpdateCallback(ctx) {
  const review = await ctx.orm.review.findById(ctx.params.id);
  ctx.assert(review, 404);
  ctx.body = await review.update(
    ctx.request.body,
    { fields: ['fullfillment_offer', 'puntuality', 'quality_offered','content'] },
  );
}

function reviewsEditRendererCallback(ctx) {
  const { review } = ctx.state;
  return ctx.render(
    'reviews/edit',
    {
      review,
      submitPath: ctx.router.url('reviews-update', review.id),
    },
  );
}

// Routes 

const router = new KoaRouter();

router.get('reviews', '/', reviewsIndexRendererCallback);
router.post('reviews-create', '/', reviewsCreateCallback);
router.patch('reviews-update', '/:id', reviewsUpdateCallback);
router.get('reviews-edit', '/:id/edit', reviewsEditRendererCallback);
router.get('reviews-show', '/:id', ctx => ctx.render(
  'reviews/show',
  {
    name: 'review',
    ignore: ['createdAt', 'updatedAt', 'id'],
    state: JSON.parse(JSON.stringify(ctx.state.review)),
  },
));
router.get('reviews-new', '/new', ctx => ctx.render(
  'reviews/new',
  {
    review: ctx.orm.review.build(),
    submitPath: ctx.router.url('reviews-create'),
  },
));

module.exports = router;