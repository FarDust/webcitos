const KoaRouter = require('koa-router');

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
  } else {
  ctx.flashMessage.notice = 'Please, log in to access these features';
  ctx.redirect('/');
  }
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

router.get('users-show', '/:id', (ctx) => {
  if (ctx.state.currentUser) {
  return ctx.render('users/show',
  {
    name: ctx.state.user.name,
    ignore: ['createdAt', 'updatedAt', 'id', 'password', 'name'],
    state: JSON.parse(JSON.stringify(ctx.state.user)),
  },)
  } else {
  ctx.flashMessage.notice = 'Please, log in to access these features';
  ctx.redirect('/');
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
  } else {
  ctx.flashMessage.notice = 'You can only edit your own profile';
  ctx.redirect('/');
  }
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
