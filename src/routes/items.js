const KoaRouter = require('koa-router');
const cloudStorage = require('../lib/cloud-storage');
const router = new KoaRouter();

router.param('id', async (id, ctx, next) => {
  const item = await ctx.orm.item.findById(ctx.params.id);
  ctx.assert(item, 404);
  ctx.state.item = item;
  return next();
});

router.get('items', '/', async (ctx) => {
  if (ctx.state.currentUser) {
    const items = await ctx.orm.item.findAll();
    return ctx.render('items/index', {
      items,
      // newItemPath: ctx.router.url('items-new'),
      getItemImagePath: item => ctx.router.url('items-show-image', item.id),
      getShowPath: item => ctx.router.url('items-show', item.id),
      getEditPath: item => ctx.router.url('items-edit', item.id),
      getDestroyPath: item => ctx.router.url('items-destroy', item.id),
      getPublicationPath: publication_id => ctx.router.url('publications-show', publication_id),
    });
  }
  ctx.flashMessage.notice = 'Please, log in to access these features';
  ctx.redirect('/');
});

router.get('items-new', '/new/:pid', (ctx) => {
  if (ctx.state.currentUser) {
    return ctx.render('items/new',
      {
        item: ctx.orm.item.build(),
        publication_id: ctx.params.pid,
        submitPath: ctx.router.url('items-create'),
      });
  }
  ctx.flashMessage.notice = 'Please, log in to access these features';
  ctx.redirect('/');
});

router.post('items-create', '/', async (ctx) => {
  const new_item = await ctx.orm.item.create(ctx.request.body);
  const { path: localImagePath, name: localImageName } = ctx.request.files.image;
  const remoteImagePath = cloudStorage.buildRemotePath(localImageName, { directoryPath: 'items/images', namePrefix: new_item.id });
  await cloudStorage.upload(localImagePath, remoteImagePath);
  await new_item.update({ image: remoteImagePath });
  ctx.redirect(ctx.router.url('publications-show', new_item.publication_id));
});

router.get('items-show', '/:id', (ctx) => {
  if (ctx.state.currentUser) {
    return ctx.render('items/show',
      {
        name: 'item',
        ignore: ['createdAt', 'updatedAt', 'id'],
        state: JSON.parse(JSON.stringify(ctx.state.item)),
      });
  }
  ctx.flashMessage.notice = 'Please, log in to access these features';
  ctx.redirect('/');
});

router.get('items-show-image', '/:id/image', async (ctx) => {
    const { image } = ctx.state.item;
  if (/^https?:\/\//.test(image)) {
    ctx.redirect(image);
  } else {
    ctx.body = cloudStorage.download(image);
  }
});

router.get('items-edit', '/:id/edit', (ctx) => {
  const { item } = ctx.state;
  if (ctx.state.currentUser) {
    return ctx.render(
      'items/edit',
      {
        item,
        submitPath: ctx.router.url('items-update', item.id),
      },
    );
  }
  ctx.flashMessage.notice = 'Please, log in to access these features';
  ctx.redirect('/');
});

router.patch('items-update', '/:id', async (ctx) => {
  const { item } = ctx.state;
  try {
    await item.update(
      ctx.request.body,
      { fields: ['model', 'brand', 'aditional', 'state', 'category', 'screenSize', 'publication_id', 'image'] },
    );
    ctx.redirect(ctx.router.url('items-show', item.id));
  } catch (error) {
    if (!isValidationError(error)) throw error;
    await ctx.render('items/edit', {
      item,
      errors: getFirstErrors(error),
      submitPath: ctx.router.url('items-update', item.id),
    });
  }
});

router.delete('items-destroy', '/:id', async (ctx) => {
  await ctx.state.item.destroy();
  ctx.redirect(ctx.router.url('items'));
});

module.exports = router;
