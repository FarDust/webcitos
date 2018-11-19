const KoaRouter = require('koa-router');
const { forEach } = require('p-iteration');
const Sequelize = require('sequelize');
const { getTradeInfo } = require('./general_info');


const router = new KoaRouter();
const { isValidationError, getFirstErrors } = require('../lib/models/validation-error');

router.param('id', async (id, ctx, next) => {
  const publication = await ctx.orm.publication.findById(ctx.params.id);
  ctx.assert(publication, 404);
  ctx.state.publication = publication;
  return next();
});

router.get('publications', '/', async (ctx) => {
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
    let trade = null;
    let review = null;
    let users_requests = {};
    let publi_requests = {};
    let items_requests = {};
    await forEach(requests, async (req) => {
      const user_req = await ctx.orm.user.findById(req.userID);
      users_requests[req.id] = user_req;
      if (req.item_offered_id) {
        const item_req = await ctx.orm.item.findById(req.item_offered_id);
        const publi_req = await item_req.getPublication();
        items_requests[req.id] = item_req;
        publi_requests[req.id] = publi_req.id;
      } else {
        items_requests[req.id] = null;
        publi_requests[req.id] = null;
      }
      trade = await req.getTrade();
      if (trade) {
        trade = await getTradeInfo(trade.id, ctx);
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
        publi_requests,
        createRequestPath: publi => ctx.router.url('requests-new', { pid: publi.id }),
        showRequestsPath: publi => ctx.router.url('requests-all', { pid: publi.id }),
        editPublicationPath: publi => ctx.router.url('publications-edit', { id: publi.id }),
        editItemPath: item => ctx.router.url('items-edit', { id: item.id }),
        destroyPublicationPath: publi => ctx.router.url('publications-destroy', { id: publi.id }),
        userPath: user => ctx.router.url('users-show', user.id),
        getUserImagePath: user => ctx.router.url('users-show-image', user.id),
        getItemImagePath: item => ctx.router.url('items-show-image', item.id),
        getItemShowPath: item => ctx.router.url('items-show', item.id),
        getPubliShowPath: publi_id => ctx.router.url('publications-show', publi_id),
        postNewTradePath: request => ctx.router.url('trades-create', {'id_request': request.id, 'state': 'pendent'}),
        getDestroyRequestPath: request => ctx.router.url('requests-destroy', request.id),
        getReviewNewUrl: trade => ctx.router.url('reviews-new', { tid: trade.id }),
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
