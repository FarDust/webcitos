const KoaRouter = require('koa-router');
const { getInfoRequests } = require('./general_info')
const { forEach } = require('p-iteration');

const router = new KoaRouter();

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

router.param('id', async (id, ctx, next) => {
  const request = await ctx.orm.request.findById(ctx.params.id);
  ctx.assert(request, 404);
  ctx.state.request = request;
  return next();
});


router.get('requests-mine', '/actualUser', async (ctx) => {
  if (ctx.state.currentUser) {
    const allRequests = await ctx.orm.request.findAll();
    const userRequests = []
    allRequests.forEach((req) => {
      if (req.userID === ctx.state.currentUser.id) {
        userRequests.push(req);
      }
    });
    const requests = await getInfoRequests(ctx, userRequests, "mine");


    return ctx.render('requests/index', {
      requests,
      publication_title: null,
      publication_state: null,
      getShowUserPath: user => ctx.router.url('users-show', {id: user.id}),
      getShowPublicationPath: publication => ctx.router.url('publications-show', {id: publication.id}),
      postNewTradePath: request => ctx.router.url('trades-new', request.id),
      getShowPath: request => ctx.router.url('requests-show', request.id),
      getEditPath: request => ctx.router.url('requests-edit', request.id),
      getDestroyPath: request => ctx.router.url('requests-destroy', request.id),
    });
  }
  ctx.flashMessage.notice = 'Please, log in to access these features';
  ctx.redirect('/');
});

router.get('requests-all', '/publications/:pid/', async (ctx) => {
  if (ctx.state.currentUser) {
    const publication = await ctx.orm.publication.findById(ctx.params.pid);
    const allRequests = await publication.getRequests();
    const requests = await getInfoRequests(ctx, allRequests, "other");

    return ctx.render('requests/index', {
      requests,
      publication_title: publication.title,
      publication_state: publication.state,
      getShowUserPath: user => ctx.router.url('users-show', {id: user.id}),
      getShowPublicationPath: publication => ctx.router.url('publications-show', {id: publication.id}),
      postNewTradePath: request => ctx.router.url('trades-create', { id_request: request.id, state: 'not_concreted' }),
      getShowPath: request => ctx.router.url('requests-show', request.id),
      getDestroyPath: request => ctx.router.url('requests-destroy', request.id),
    });
  }
  ctx.flashMessage.notice = 'Please, log in to access these features';
  ctx.redirect('/');
});

router.get('requests-new', '/publications/:pid/new', async (ctx) => {
  if (ctx.state.currentUser) {
    const publication = await ctx.orm.publication.findById(ctx.params.pid);
    const user_items = [];
    const user_publications = await ctx.state.currentUser.getPublications();
    const allRequests = await ctx.orm.request.findAll();
    const used_items = [];
    await forEach(allRequests, async (req) => {
      if (req.userID === ctx.state.currentUser.id) {
        const req_trade = await req.getTrade();
        if (!req_trade) {
          used_items.push(req.item_offered_id);
        } else if (req_trade.state != 'not_concreted') {
          used_items.push(req.item_offered_id);
        }
      }
    });
    await asyncForEach(user_publications, async (publi) => {
      const n_item = await publi.getItem();
      if (!used_items.includes(n_item.id) && publi.state == 'exchange') {
        user_items.push(n_item);
      }
    });

    if (user_publications.length === 0 && publication.state !== 'gift') {
      ctx.flashMessage.notice = "You don't have any items to exchange";
      return ctx.redirect(ctx.router.url('publications-new'));
    }
    if (user_items.length === 0 && publication.state !== 'gift') {
      ctx.flashMessage.notice = "You've already offered all your exchangeable items!";
      return ctx.redirect(ctx.router.url('publications-show', { id: ctx.params.pid }));
    }

    return ctx.render('requests/new',
      {
        request: ctx.orm.request.build(),
        publication_id: ctx.params.pid,
        publication_state: publication.state,
        user_items,
        user_id: ctx.state.currentUser.id,
        submitPath: ctx.router.url('requests-create'),
      });
  }
  ctx.flashMessage.notice = 'Please, log in to access these features';
  ctx.redirect('/');
});

router.post('requests-create', '/', async (ctx) => {
  await ctx.orm.request.create(ctx.request.body);
  ctx.redirect(ctx.router.url('publications-show', { id: ctx.request.body.publication_id }));
});

router.get('requests-show', '/:id', (ctx) => {
  if (ctx.state.currentUser) {
    const name = `Request ${ctx.state.request.id.toString()}`;
    return ctx.render('requests/show',
      {
        name,
        ignore: ['createdAt', 'updatedAt', 'id'],
        state: JSON.parse(JSON.stringify(ctx.state.request)),
      });
  }
  ctx.flashMessage.notice = 'Please, log in to access these features';
  ctx.redirect('/');
});

router.get('requests-edit', '/:id/edit', (ctx) => {
  const { request } = ctx.state;
  if (ctx.state.currentUser) {
    return ctx.render(
      'requests/edit',
      {
        request,
        submitPath: ctx.router.url('requests-update', request.id),
      },
    );
  }
  ctx.flashMessage.notice = 'Please, log in to access these features';
  ctx.redirect('/');
});

router.patch('requests-update', '/:id', async (ctx) => {
  const { request } = ctx.state;
  try {
    await request.update(
      ctx.request.body,
      { fields: ['message'] },
    );
    ctx.redirect(ctx.router.url('requests-show', request.id));
  } catch (error) {
    if (!isValidationError(error)) throw error;
    await ctx.render('requests/edit', {
      request,
      errors: getFirstErrors(error),
      submitPath: ctx.router.url('requests-update', request.id),
    });
  }
});

router.delete('requests-destroy', '/:id', async (ctx) => {
  await ctx.state.request.destroy();
  ctx.redirect(ctx.router.url('publications'));
});

module.exports = router;
