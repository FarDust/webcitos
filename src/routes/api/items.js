const _ = require('lodash');
const KoaRouter = require('koa-router');

const router = new KoaRouter();

function apiUrl(ctx, ...params) {
	return `${ctx.origin}${ctx.router.url(...params)}`;
}

router.get('items', '/', async (ctx) => {
  const items = await ctx.orm.item.findAll();
  const itemsJSON = items.map(item => ({
    ..._.pick(item, 'id', 'model', 'brand', 'category', 'screenSize'),
    links: {
    	self: apiUrl(ctx, 'items-show', item.id),
    	publication: apiUrl(ctx, 'publications-show', item.id),
    },
  }));
  ctx.body = itemsJSON;
});

router.get('items-show', '/:id', async (ctx) => {
  const item = await ctx.orm.item.findById(ctx.params.id);
  ctx.body = _.pick(item, 'id', 'model', 'brand', 'aditional', 'state', 'category', 'screenSize', 'publication_id', 'image','createdAt');
});

module.exports = router;