const KoaRouter = require('koa-router');

const index = require('./routes/index');
const hello = require('./routes/hello');
const users = require('./routes/users');
const trades = require('./routes/trades');

const router = new KoaRouter();

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/users', users.routes());
router.use('/trades', trades.routes());

module.exports = router;
