const KoaRouter = require('koa-router');
const jwtSign = require('jsonwebtoken').sign;

const router = new KoaRouter();

router.get('users-me', '/me', async (ctx) => {
  ctx.assert(ctx.state.jwtdata, 401);
  const user = await ctx.orm.user.findById(ctx.state.jwtdata.userId);
  ctx.assert(ctx.state.jwtdata, 403);
  ctx.body = user;
 });

router.put('users-session', '/session', async (ctx) => {
  const { email, password } = ctx.request.body;
  const user = await ctx.orm.user.findOne({ where: { email, password } });
  if (user) {
  	const token = await new Promise((resolve, reject) => {
      jwtSign(
        { userId: user.id },
        process.env.JWT_SECRET,
        (err, tokenResult) => (err ? reject(err) : resolve(tokenResult)),
      );
    });
    ctx.body = { token };
  } else {
    ctx.throw(401, 'Wrong e-mail or password');
  }
});

module.exports = router;