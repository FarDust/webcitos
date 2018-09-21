const KoaRouter = require('koa-router');

const index = require('./routes/index');
const publications = require('./routes/publications');
const items = require('./routes/items');
const requests = require('./routes/requests');
const users = require('./routes/users');

const router = new KoaRouter();

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/publications', publications.routes());
router.use('/items', items.routes());
router.use('/requests', requests.routes());
router.use('/users', users.routes());

module.exports = router;
