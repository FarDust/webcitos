const KoaRouter = require('koa-router');
const index = require('./routes/index');
const hello = require('./routes/hello');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

const router = new KoaRouter();

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/users', users.routes());
router.use('/reviews', reviews.routes());

module.exports = router;
