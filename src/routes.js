const KoaRouter = require('koa-router');
const index = require('./routes/index');
const publications = require('./routes/publications');
const items = require('./routes/items');
const requests = require('./routes/requests');
const users = require('./routes/users');
const reviews = require('./routes/reviews');
const trades = require('./routes/trades');
const session = require('./routes/session');
const hello = require('./routes/hello')

const router = new KoaRouter();

router.use(async (ctx, next) => {
  Object.assign(ctx.state, {
    newSessionPath: ctx.router.url('session-new'),
    destroySessionPath: ctx.router.url('session-destroy'),
  });
  return next();
});

router.use(async (ctx, next) => {
  if (ctx.session.currentUserId) {
    ctx.state.currentUser = await ctx.orm.user.findById(ctx.session.currentUserId);
  }
  return next();
});

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/publications', publications.routes());
router.use('/items', items.routes());
router.use('/requests', requests.routes());
router.use('/users', users.routes());
router.use('/reviews', reviews.routes());
router.use('/trades', trades.routes());
router.use('/session', session.routes());

module.exports = router;
