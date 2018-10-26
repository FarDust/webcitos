const KoaRouter = require('koa-router');
const Sequelize = require('sequelize');
const pkg = require('../../package.json');

const router = new KoaRouter();

router.get('/', async (ctx) => {
  await ctx.render('index', { appVersion: pkg.version });
});

router.get('search', '/search', async (ctx) => {
  let search = ctx.request.query['query'];
  let publications = await ctx.orm.publication.findAll(
    {
      where: {
        [Sequelize.Op.or]: [
          { title: { [Sequelize.Op.iLike]: '%${search}', }, },
          { description: {[Sequelize.Op.iLike]: '%${search}', }, },
        ],
      },
    },
  );
  let publications_item = await ctx.orm.publication.findAll(
    {
      include: [
        {
          model: ctx.orm.item,
          required: true,
          where: {
            [Sequelize.Op.or]: [
              { model: { [Sequelize.Op.iLike]: '%${search}', }, },
              { brand: { [Sequelize.Op.iLike]: '%${search}', }, },
            ],
          },
        },
      ],
    });
  let users = await ctx.orm.user.findAll({ where: { name: { [Sequelize.Op.iLike]: '%${search}' } } });
  await ctx.render('search', {
    publications,
    publications_item,
    users,
    publicationShowPath : ctx.router.url('publications-show'),
  });
});

module.exports = router;
