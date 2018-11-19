const KoaRouter = require('koa-router');
const Sequelize = require('sequelize');
const vision = require('@google-cloud/vision'); 

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

router.get('search-api', '/api', async (ctx) => {
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
  ctx.body = publications;
});

router.get('search-vision', '/test', async (ctx) => {
  const client = new vision.ImageAnnotatorClient({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  });
  client
  .labelDetection('https://target.scene7.com/is/image/Target/GUEST_869df002-c5e0-4b9f-9636-56332268c6cf?wid=488&hei=488&fmt=pjpeg')
  .then(results => {
    const labels = results[0].labelAnnotations;

    console.log('Labels:');
    labels.forEach(label => console.log(label.description));
    ctx.body = labels;
  })
  .catch(err => {
    console.error('ERROR:', err);
    });
})

module.exports = router;
