const KoaRouter = require('koa-router');
const router = new KoaRouter();
router.get('users', '/', async (ctx) => {
  ctx.body = await ctx.orm.user.findAll();
});

router.post('users-create', '/', async (ctx) => {
  await ctx.orm.user.create(ctx.request.body);
  ctx.redirect(ctx.router.url('users'));
});

router.get('users-show', '/:id', async (ctx) => {
  const user = await ctx.orm.user.findById(ctx.params.id);
  ctx.assert(user, 404);
  ctx.body = user;
});
router.patch('users-update', '/:id', async (ctx) => {
  const user = await ctx.orm.user.findById(ctx.params.id);
  ctx.assert(user, 404);
  ctx.body = await user.update(
    ctx.request.body,
    { fields: ['name', 'password'] },
  );
});
router.delete('users-destroy', '/:id', async (ctx) => {
  const user = await ctx.orm.user.findById(ctx.params.id);
  ctx.assert(user, 404);
  await user.destroy();
  ctx.redirect(ctx.router.url('users'));
});


module.exports = router;
