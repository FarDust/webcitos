const KoaRouter = require('koa-router');
const router = new KoaRouter();

router.param('id', async (id, ctx, next) => {
  const item = await ctx.orm.item.findById(ctx.params.id);
  ctx.assert(item, 404);
  ctx.state.item = item;
  return next();
});

router.get('items', '/', async (ctx) => {
  const items = await ctx.orm.item.findAll();
  return ctx.render('items/index', {
    items,
    newItemPath: ctx.router.url('items-new'),
    getShowPath: item => ctx.router.url('items-show', item.id),
    getEditPath: item => ctx.router.url('items-edit', item.id),
    getDestroyPath: item => ctx.router.url('items-destroy', item.id),
  });
});

router.get('items-new', '/new', ctx => ctx.render(
  'items/new',
  {
    item: ctx.orm.item.build(),
    submitPath: ctx.router.url('items-create'),
  },
));

router.post('items-create', '/', async (ctx) => {
  await ctx.orm.item.create(ctx.request.body);
  ctx.redirect(ctx.router.url('items'));
});

router.get('items-show', '/:id', ctx => ctx.render(
  'items/show',
  {
    name: 'item',
    ignore: ['createdAt', 'updatedAt', 'id'],
    state: JSON.parse(JSON.stringify(ctx.state.item)),
  },
));

router.get('items-edit', '/:id/edit', (ctx) => {
  const { item } = ctx.state;
  return ctx.render(
    'items/edit',
    {
      item,
      submitPath: ctx.router.url('items-update', item.id),
    },
  );
});

router.patch('items-update', '/:id', async (ctx) => {
   const { item } = ctx.state;
   try {
     await item.update(
       ctx.request.body,
       { fields: ['model', 'brand', 'aditional', 'state', 'category', 'screenSize', 'publication_id'] },
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
