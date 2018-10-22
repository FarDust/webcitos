const KoaRouter = require('koa-router');
const Sequelize = require('sequelize');
const { forEach } = require('p-iteration');
const cloudStorage = require('../lib/cloud-storage');
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
      getUserImagePath: user => ctx.router.url('users-show-image', user.id),
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
    if (ctx.request.files.image.name) {
      const { path: localImagePath, name: localImageName } = ctx.request.files.image;
      const remoteImagePath = cloudStorage.buildRemotePath(localImageName, { directoryPath: 'users/images', namePrefix: user.id });
      await cloudStorage.upload(localImagePath, remoteImagePath);
      await user.update({ image: remoteImagePath });
    }else{
      await user.update({ image: 'users/images/profile-placeholder.jpg' });
    }
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


async function getActiveTrades(target, orm, user, type) {
  const trades = await orm.trade.count(
    {
      where: {
        state: { [Sequelize.Op.ne]: 'concreted' },
      },
      include: [
        {
          model: orm.request,
          required: true,
          include: [
            {
              model: orm.publication,
              required: true,
              where: { state: type },
              include: [
                {
                  model: orm.user,
                  required: true,
                  where: { id: user.id },
                },
              ],
            },
          ],
        },
      ],
    },
  );
  return trades;
}

async function getEndedTrades(target, orm, user) {
  const trades = await orm.trade.count(
    {
      where: {
        state: 'concreted',
      },
      include: [
        {
          model: orm.request,
          required: true,
          include: [
            {
              model: orm.publication,
              required: true,
              include: [
                {
                  model: orm.user,
                  required: true,
                  where: { id: user.id },
                },
              ],
            },
          ],
        },
      ],
    },
  );
  return trades;
}

async function getActiveTradeNumber(orm, user, type) {
  const tradeNumber = await getActiveTrades(orm.trade.count, orm, user, type);
  return tradeNumber;
}

async function getEndedTradeNumber(orm, user) {
  const tradeNumber = await getEndedTrades(orm.trade.count, orm, user);
  return tradeNumber;
}

/* Solucionar problema de identificar que tipo eran las publications */
async function getStatics(orm, user) {
  const statics = {
    exchange: {
      active: await getActiveTradeNumber(orm, user, 'exchange'),
      ended: await getEndedTradeNumber(orm, user),
    },
    gift: {
      active: await getActiveTradeNumber(orm, user, 'gift'),
      ended: await getEndedTradeNumber(orm, user),
    },
  };
  return statics;
}

router.get('users-show', '/:id', async (ctx) => {
  if (ctx.state.currentUser) {
    const publication = await ctx.state.user.getPublications();
    const user = ctx.state.user;
    return ctx.render('users/show',
      {
        name: user.name,
        user_id: user.id,
        userEditPath: user_id => ctx.router.url('users-edit', user_id),
        ignore: ['createdAt', 'updatedAt', 'id', 'password', 'name'],
        publications: publication,
        newPublicationPath: ctx.router.url('publications-new'),
        showPublicationPath: publi => ctx.router.url('publications-show', { id: publi.id }),
        showRequestsPath: publi => ctx.router.url('requests-all', { pid: publi.id }),
        showMineRequestsPath: ctx.router.url('requests-mine'),
        showMineTradesPath: ctx.router.url('users-trades', user.id),
        getDestroyPublicationPath: publi => ctx.router.url('publications-destroy', { id: publi.id }),
        state: JSON.parse(JSON.stringify(user)),
        statics: await getStatics(ctx.orm, ctx.state.currentUser),
      });
  }
  ctx.flashMessage.notice = 'Please, log in to access these features';
  ctx.redirect('/');
});

router.get('users-show-image', '/:id/image', async (ctx) => {
   const { image } = ctx.state.user;
   if (/^https?:\/\//.test(image)) {
    ctx.redirect(image);
   } else {
    ctx.body = cloudStorage.download(image);
  }
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
    if (ctx.request.files.image.name) {
      const { path: localImagePath, name: localImageName } = ctx.request.files.image;
      const remoteImagePath = cloudStorage.buildRemotePath(localImageName, { directoryPath: 'users/images', namePrefix: user.id });
      await cloudStorage.upload(localImagePath, remoteImagePath);
      await user.update({ image: remoteImagePath });
    }
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
