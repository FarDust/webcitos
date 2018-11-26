const KoaRouter = require('koa-router');
const Sequelize = require('sequelize');
const pkg = require('../../package.json');
const { forEach } = require('p-iteration');

const router = new KoaRouter();

router.get('/', async (ctx) => {
	if (ctx.state.currentUser) {
		const publications = await ctx.orm.publication.findAll();
    let users_names = {};
    let items_ids = {};
    await forEach(publications, async (pub) => {
      const user = await pub.getUser();
      users_names[pub.id] = user.name;
    });
    await forEach(publications, async (pub) => {
      const item = await pub.getItem();
      items_ids[pub.id] = item.id;
      pub.dataValues['item'] = item;
    });
    return ctx.render('publications/index', {
      publications,
      users_names,
      items_ids,
      getItemImagePath: item_id => ctx.router.url('items-show-image', item_id),
      newpublicationPath: ctx.router.url('publications-new'),
      getShowPath: publication => ctx.router.url('publications-show', publication.id),
      getEditPath: publication => ctx.router.url('publications-edit', publication.id),
      getDestroyPath: publication => ctx.router.url('publications-destroy', publication.id),
    });
	} else {
		const publications = await ctx.orm.publication.findAll();
  	const pub_json = JSON.stringify(publications);
  	await ctx.render('index', {
    	appVersion: pkg.version,
    	'publications': pub_json,
	  });
	}
});

module.exports = router;
