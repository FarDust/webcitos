const _ = require('lodash');
const KoaRouter = require('koa-router');

const router = new KoaRouter();

function apiUrl(ctx, ...params) {
	return `${ctx.origin}${ctx.router.url(...params)}`;
}

router.get('publications', '/', async (ctx) => {
  const publications = await ctx.orm.publication.findAll();
  const publicationsJSON = publications.map(publi => ({
    ..._.pick(publi, 'id', 'title', 'description', 'state'),
    links: {
    	self: apiUrl(ctx, 'publications-show', publi.id),
      item: apiUrl(ctx, 'items-show', publi.id),
    },
  }));
  ctx.body = publicationsJSON;
});

router.get('publications-show', '/:id', async (ctx) => {
  const publication = await ctx.orm.publication.findById(ctx.params.id);
  ctx.body = _.pick(publication, 'id', 'title', 'description', 'state', 'userID', 'createdAt');
});

module.exports = router;