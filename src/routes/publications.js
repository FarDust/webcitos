const KoaRouter = require('koa-router');

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
    return ctx.render('publications/index', {
      publications,
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
    const users = await ctx.orm.user;
    const proper_user = await users.findById(ctx.state.publication.userID);
    const items = await ctx.state.publication.getItem();
    return ctx.render('publications/show',
      {
        name: 'publication',
        ignore: ['createdAt', 'updatedAt', 'id'],
        propietary_user: proper_user,
        createRequestPath: publi => ctx.router.url('requests-new', { pid: publi.id }),
        showRequestsPath: publi => ctx.router.url('requests-all', { pid: publi.id }),
        editPublicationPath: publi => ctx.router.url('publications-edit', { id: publi.id }),
        editItemPath: item => ctx.router.url('items-edit', { id: item.id }),
        destroyPublicationPath: publi => ctx.router.url('publications-destroy', { id: publi.id }),
        userPath: user => ctx.router.url('users-show', user.id),
        item: JSON.parse(JSON.stringify(items)),
        state: JSON.parse(JSON.stringify(ctx.state.publication)),
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
