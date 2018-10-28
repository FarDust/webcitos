const KoaRouter = require('koa-router');
const { forEach } = require('p-iteration');
const Sequelize = require('sequelize');


const router = new KoaRouter();
const { isValidationError, getFirstErrors } = require('../lib/models/validation-error');

router.param('id', async (id, ctx, next) => {
  const publication = await ctx.orm.publication.findById(ctx.params.id);
  ctx.assert(publication, 404);
  ctx.state.publication = publication;
  return next();
});

router.get('publications', '/', async (ctx) => {
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
  }
  ctx.flashMessage.notice = 'Please, log in to access these features';
  ctx.redirect('/');
});

router.get('publications-new', '/new', (ctx) => {
  if (ctx.state.currentUser) {
    return ctx.render('publications/new',
      {
        publication: ctx.orm.publication.build(),
        submitPath: ctx.router.url('publications-create'),
      });
  }
  ctx.flashMessage.notice = 'Please, log in to access these features';
  ctx.redirect('/');
});

router.post('publications-create', '/', async (ctx) => {
  const publication = ctx.orm.publication.build(ctx.request.body);
  try {
    await publication.save(ctx.request.body);
    ctx.redirect(ctx.router.url('items-new', { pid: publication.id }));
  } catch (error) {
    if (!isValidationError(error)) throw error;
    await ctx.render('publications/new', {
      publication,
      errors: getFirstErrors(error),
      submitPath: ctx.router.url('publications-create'),
    });
  }
});

router.get('publications-show', '/:id', async (ctx) => {
  if (ctx.state.currentUser) {
    const publication = ctx.state.publication;
    const user = await ctx.orm.user.findById(ctx.state.publication.userID);
    const item = await ctx.state.publication.getItem();
    const requests = await publication.getRequests();
    let trade;
    let review;
    let users_requests = {};
    let items_requests = {};
    await forEach(requests, async (req) => {
      const user_req = await ctx.orm.user.findById(req.userID);
      const item_req = await ctx.orm.item.findById(req.item_offered_id);
      users_requests[req.id] = user_req.name;
      items_requests[req.id] = item_req;
      trade = await req.getTrade();
      // console.log('trade!!!!', trade)
      if (trade) {
        review = await trade.getReview();
      }
    });
    return ctx.render('publications/show',
      {
        publication,
        user,
        item,
        requests,
        trade,
        review,
        users_requests,
        items_requests,
        createRequestPath: publi => ctx.router.url('requests-new', { pid: publi.id }),
        showRequestsPath: publi => ctx.router.url('requests-all', { pid: publi.id }),
        editPublicationPath: publi => ctx.router.url('publications-edit', { id: publi.id }),
        editItemPath: item => ctx.router.url('items-edit', { id: item.id }),
        destroyPublicationPath: publi => ctx.router.url('publications-destroy', { id: publi.id }),
        userPath: user => ctx.router.url('users-show', user.id),
        getUserImagePath: user => ctx.router.url('users-show-image', user.id),
        getItemImagePath: item => ctx.router.url('items-show-image', item.id),
        getItemShowPath: item => ctx.router.url('items-show', item.id),
      });
  }
  ctx.flashMessage.notice = 'Please, log in to access these features';
  ctx.redirect('/');
});

router.get('publications-edit', '/:id/edit', (ctx) => {
  const { publication } = ctx.state;
  if (ctx.state.currentUser) {
    return ctx.render(
      'publications/edit',
      {
        publication,
        submitPath: ctx.router.url('publications-update', publication.id),
      },
    );
  }
  ctx.flashMessage.notice = 'Please, log in to access these features';
  ctx.redirect('/');
});

router.patch('publications-update', '/:id', async (ctx) => {
  const { publication } = ctx.state;
  try {
    await publication.update(
      ctx.request.body,
      { fields: ['title', 'description', 'state'] },
    );
    ctx.redirect(ctx.router.url('publications-show', publication.id));
  } catch (error) {
    if (!isValidationError(error)) throw error;
    await ctx.render('publications/edit', {
      publication,
      errors: getFirstErrors(error),
      submitPath: ctx.router.url('publications-update', publication.id),
    });
  }
});

router.delete('publications-destroy', '/:id', async (ctx) => {
  await ctx.state.publication.destroy();
  ctx.redirect(ctx.router.url('publications'));
});

module.exports = router;
