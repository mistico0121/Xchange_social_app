const KoaRouter = require('koa-router');

const router = new KoaRouter();

const jwt = require("jsonwebtoken");

require("dotenv").config();

const jwtKey = process.env.JWT_KEY;
const jwtExpirySeconds = 300;

router.get('session.new', '/sign_in', (ctx) => {
  return ctx.render('sessions/sign_in', {
    createSessionPath: ctx.router.url('session.create'),
    notice: ctx.flashMessage.notice,
  });
});

router.put('session.create', '/', async (ctx) => {
  const { username, password } = JSON.parse(ctx.request.body);
  const user = await ctx.orm.user.findOne({ where: { username } });
  const isPasswordCorrect = user && await user.checkPassword(password);
  console.log(isPasswordCorrect);
  if (isPasswordCorrect) {
    ctx.session.userId = user.id;

    // Create a new token with the username in the payload
    // and which expires 300 seconds after issue
    const token = jwt.sign({ username }, jwtKey, {
      algorithm: "HS256",
      expiresIn: jwtExpirySeconds,
    });

    // set the cookie as the token string, with a similar max age as the token
    // here, the max age is in milliseconds, so we multiply by 1000
    ctx.cookies.set("token", token, { maxAge: jwtExpirySeconds * 1000 });
    // return ctx.redirect(ctx.router.url('groups.list'));
    // ctx.body = {iscorrect: isPasswordCorrect};
  } else {
    ctx.status = 401;
  }
  ctx.body = {iscorrect: isPasswordCorrect};
  // return ctx.body;
});

router.delete('session.destroy', '/', (ctx) => {
  ctx.session = null;
  ctx.redirect(ctx.router.url('session.new'));
});


module.exports = router;
