const KoaRouter = require('koa-router');
const Sequelize = require('sequelize');

const router = new KoaRouter();

router.get('search', '/', async (ctx) => {
  const search = ctx.request.query.query;
  const publications = await ctx.orm.publication.findAll(
    {
      where: {
        [Sequelize.Op.or]: [
          { title: { [Sequelize.Op.iLike]: `%${search}%` } },
          { description: { [Sequelize.Op.iLike]: `%${search}%` } },
        ],
      },
    },
  );
  const publications_item = await ctx.orm.publication.findAll(
    {
      include: [
        {
          model: ctx.orm.item,
          required: true,
          where: {
            [Sequelize.Op.or]: [
              { model: { [Sequelize.Op.iLike]: `%${search}%` } },
              { brand: { [Sequelize.Op.iLike]: `%${search}%` } },
            ],
          },
        },
      ],
    },
  );
  const users = await ctx.orm.user.findAll({ where: { name: { [Sequelize.Op.iLike]: `%${search}%` } } });
  return ctx.render('search', {
    publications,
    publications_item,
    users,
    publicationShowPath: publication => ctx.router.url('publications-show', publication.id),
    usersShowPath: user => ctx.router.url('users-show', user.id),
  });
});

module.exports = router;
