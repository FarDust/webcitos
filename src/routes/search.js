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

router.post('search-vision', '/test', async (ctx) => {
  const client = new vision.ImageAnnotatorClient({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  });
  let dataUriToBuffer = require('data-uri-to-buffer');
  const decoded = dataUriToBuffer(ctx.request.body.image);
  const results = await client.labelDetection(decoded);
  const webResults = await client.webDetection(decoded);
  const logoResults = await client.logoDetection(decoded);
  ctx.body = {
    labels: results[0].labelAnnotations,
  };
  if (webResults[0].webDetection.webEntities.length) {
    ctx.body.webDetection = webResults[0].webDetection.webEntities[0];
  }
  if (logoResults[0].logoAnnotations.length) {
    ctx.body.logoDetection = logoResults[0].logoAnnotations[0];
  }
})

module.exports = router;
