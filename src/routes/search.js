const KoaRouter = require('koa-router');
const Sequelize = require('sequelize');

const router = new KoaRouter();

router.get('search', '/', async (ctx) => {
  let search = ctx.request.query['query'];
  let publications = await ctx.orm.publication.findAll(
    {
      where: {
        [Sequelize.Op.or]: [
          { title: { [Sequelize.Op.iLike]: `%${search}%`, }, },
          { description: {[Sequelize.Op.iLike]: `%${search}%`, }, },
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
              { model: { [Sequelize.Op.iLike]: `%${search}%`, }, },
              { brand: { [Sequelize.Op.iLike]: `%${search}%`, }, },
            ],
          },
        },
      ],
    });
  let users = await ctx.orm.user.findAll({ where: { name: { [Sequelize.Op.iLike]: `%${search}%` } } });
  return ctx.render('search', {
    publications,
    publications_item,
    users,
    publicationShowPath : publication => ctx.router.url('publications-show', publication.id),
  });
});

module.exports = router;
