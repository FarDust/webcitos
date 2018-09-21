const KoaRouter = require('koa-router');

const index = require('./routes/index');
const hello = require('./routes/hello');
const users = require('./routes/users');

const router = new KoaRouter();

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/users', users.routes());

module.exports = router;
