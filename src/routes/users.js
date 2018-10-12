const KoaRouter = require('koa-router');
const { forEach } = require('p-iteration');

const { isValidationError, getFirstErrors } = require('../lib/models/validation-error');

const router = new KoaRouter();

router.param('id', async (id, ctx, next) => {
  const user = await ctx.orm.user.findById(ctx.params.id);
  ctx.assert(user, 404);
  ctx.state.user = user;
  return next();
});

router.get('users', '/', async (ctx) => {
  if (ctx.state.currentUser) {
    const users = await ctx.orm.user.findAll();
    return ctx.render('users/index', {
      users,
      newUserPath: ctx.router.url('users-new'),
      getShowPath: user => ctx.router.url('users-show', user.id),
      getEditPath: user => ctx.router.url('users-edit', user.id),
      getDestroyPath: user => ctx.router.url('users-destroy', user.id),
    });
  }
  ctx.flashMessage.notice = 'Please, log in to access these features';
  ctx.redirect('/');
});

router.get('users-new', '/new', ctx => ctx.render(
  'users/new',
  {
    user: ctx.orm.user.build(),
    submitPath: ctx.router.url('users-create'),
  },
));

router.post('users-create', '/', async (ctx) => {
  const user = ctx.orm.user.build(ctx.request.body);
  try {
    await user.save(ctx.request.body);
    ctx.redirect('/');
  } catch (error) {
    if (!isValidationError(error)) throw error;
    await ctx.render('users/new', {
      user,
      errors: getFirstErrors(error),
      submitPath: ctx.router.url('users-create'),
    });
  }
});

router.get('users-show', '/:id', async (ctx) => {
  if (ctx.state.currentUser) {
    const publication = await ctx.state.user.getPublications();
    const user = ctx.state.user;
    return ctx.render('users/show',
      {
        name: user.name,
        ignore: ['createdAt', 'updatedAt', 'id', 'password', 'name'],
        publications: publication,
        newPublicationPath: ctx.router.url('publications-new'),
        showPublicationPath: publi => ctx.router.url('publications-show', { id: publi.id }),
        showRequestsPath: publi => ctx.router.url('requests-all', { pid: publi.id }),
        showMineRequestsPath: ctx.router.url('requests-mine'),
        state: JSON.parse(JSON.stringify(user)),
      });
  }
  ctx.flashMessage.notice = 'Please, log in to access these features';
  ctx.redirect('/');
});

router.get('users-edit', '/:id/edit', (ctx) => {
  const { user } = ctx.state;
  if (ctx.session.currentUserId == user.id) {
    return ctx.render(
      'users/edit',
      {
        user,
        submitPath: ctx.router.url('users-update', user.id),
      },
    );
  }
  ctx.flashMessage.notice = 'You can only edit your own profile';
  ctx.redirect('/');
});

router.get('users-trades', '/:id/trades', async (ctx) => {
  const { user } = ctx.state;
  if (ctx.session.currentUserId == user.id) {
    const publications = await ctx.state.currentUser.getPublications();
    const own_requests = await ctx.state.currentUser.getRequests();
    const requests = [];
    const trades = [];
    const reviews = [];
    const own_requests_id = [];
    await forEach(publications, async (pub) => {
      const requests = await pub.getRequests();
      // console.log('requests',requests)
      await forEach(requests, async (req) => {
        const trade = await req.getTrade();
        // console.log('trade!!!!', trade)
        if (trade) {
          const review = await trade.getReview();
          reviews.push(review);
          trades.push(trade);
        }
      });
    });
    // console.log(trades);
    await forEach(own_requests, async (req) => {
      const trade = await req.getTrade();
      if (trade) {
        const review = await trade.getReview();
        reviews.push(review);
        trades.push(trade);
        own_requests_id.push(trade.id_request);
      }
    });
    // console.log('REVIEWS', reviews);
    return ctx.render(
      'users/trades',
      {
        user,
        trades,
        reviews,
        own_requests_id,
        tradesUrl: ctx.router.url('trades-show', { id: '0' }),
        requestsUrl: ctx.router.url('requests-show', { id: '0' }),
        reviewsUrl: ctx.router.url('reviews-show', { id: '0' }),
        reviewNewUrl: ctx.router.url('reviews-new', { tid: '0' }),
      },
    );
  }

  ctx.flashMessage.notice = 'Please, log in to access these features';
  ctx.redirect('/');
});

router.patch('users-update', '/:id', async (ctx) => {
  const { user } = ctx.state;
  try {
    await user.update(
      ctx.request.body,
      { fields: ['name', 'phone', 'email', 'password'] },
    );

    ctx.redirect(ctx.router.url('users-show', user.id));
  } catch (error) {
    if (!isValidationError(error)) throw error;
    await ctx.render('users/edit', {
      user,
      errors: getFirstErrors(error),
      submitPath: ctx.router.url('users-update', user.id),
    });
  }
});

router.delete('users-destroy', '/:id', async (ctx) => {
  await ctx.state.user.destroy();
  ctx.redirect(ctx.router.url('users'));
});

module.exports = router;
