const KoaRouter = require('koa-router');
const jwt = require('koa-jwt');
const publicationsRouter = require('./publications');
const itemsRouter = require('./items');
const usersRouter = require('./users');
const requestsRouter = require('./requests');

const router = new KoaRouter({ prefix: '/api' });

router.use(jwt({ secret: process.env.JWT_SECRET, passthrough: true, key: 'jwtdata' }));

router.use('/publications', publicationsRouter.routes());
router.use('/items', itemsRouter.routes());
router.use('/users', usersRouter.routes());
router.use('/requests', requestsRouter.routes());

module.exports = router;
