const KoaRouter = require('koa-router');
const Sequelize = require('sequelize');
const pkg = require('../../package.json');

const router = new KoaRouter();

router.get('/', async (ctx) => {
  const publications = await ctx.orm.publication.findAll();
  const pub_json = JSON.stringify(publications);
  await ctx.render('index', {
    appVersion: pkg.version,
    'publications': pub_json,
  });
});

module.exports = router;
