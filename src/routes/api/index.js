const KoaRouter = require('koa-router');
const publicationsRouter = require('./publications');
const itemsRouter = require('./items');

const router = new KoaRouter({ prefix: '/api' });

router.use('/publications', publicationsRouter.routes());
router.use('/items', itemsRouter.routes());

module.exports = router;