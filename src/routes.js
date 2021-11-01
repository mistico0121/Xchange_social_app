const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const users = require('./routes/users');
const groups = require('./routes/groups');
const publications = require('./routes/publications');
const reports = require('./routes/reports');
const search = require('./routes/search');
const reviews = require('./routes/reviews');
const sessions = require('./routes/sessions');
const comments = require('./routes/comments');
const deals = require('./routes/deals');
const ofertas = require('./routes/ofertas');
const ofertacomments = require('./routes/ofertacomments');
const api = require('./routes/api');

const router = new KoaRouter();

router.use(async (ctx, next) => {

  Object.assign(ctx.state, {
    currentUser: ctx.session.userId && await ctx.orm.user.findByPk(ctx.session.userId),
    newSessionPath: ctx.router.url('session.new'),
    destroySessionPath: ctx.router.url('session.destroy'),
    coursesPath: ctx.router.url('courses.list'),
    searchPath: ctx.router.url('search.list'),

  });
  return next();
});

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/users', users.routes());
router.use('/groups', groups.routes());
router.use('/publications', publications.routes());
router.use('/reports', reports.routes());
router.use('/search', search.routes());
router.use('/reviews', reviews.routes());
router.use('/sessions', sessions.routes());
router.use('/comments', comments.routes());
router.use("/deals", deals.routes());
router.use("/ofertas", ofertas.routes());
router.use("/ofertacomments", ofertacomments.routes());
router.use("/api", api.routes());

module.exports = router;
