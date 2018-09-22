const KoaRouter = require('koa-router');

// Callbacks 

async function reviewsIndexRendererCallback(ctx) {
  ctx.body = await ctx.orm.review.findAll();
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
    { fields: ['fullfilment_offer', 'puntuality', 'quality_offered','content'] },
  );
}

// Routes 

const router = new KoaRouter();

router.get('reviews', '/', reviewsIndexRendererCallback);
router.get('reviews-new', '/new', ctx => ctx.render(
  'reviews/new',
  {
    review: ctx.orm.review.build(),
    submitPath: ctx.router.url('reviews-create'),
  },
));
router.post('reviews-create', '/', reviewsCreateCallback);
router.get('trades-show', '/:id', ctx => ctx.render(
  'trades/show',
  {
    name: 'trade',
    ignore: ['createdAt', 'updatedAt', 'id'],
    state: JSON.parse(JSON.stringify(ctx.state.trade)),
  },
));
router.patch('reviews-update', '/:id', reviewsUpdateCallback);

module.exports = router;