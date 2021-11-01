const KoaRouter = require('koa-router');

const router = new KoaRouter();
const Sequelize = require('sequelize');

const { Op } = Sequelize;
// eslint-disable-next-line no-unused-vars
async function loadGroup(ctx, next) {
  ctx.state.param = ctx.params.param;
  return next();
}
router.post('search.list', '/', async (ctx) => {
  let searched = '';
  let category = '';
  switch (ctx.accepts(["json", "html"])) {
    case "json":
      searched = JSON.parse(ctx.request.body).search;
      category = JSON.parse(ctx.request.body).category;
      break;
    case "html":
      searched = ctx.request.body.search;
      category = ctx.request.body.category;
      break;
    default:
      break;
  }
  const groupsList = await ctx.orm.group.findAll({
    where: {
      name: {
        [Op.like]: '%'.concat(searched).concat('%'),
      },
    },
  });
  const usersList = await ctx.orm.user.findAll({
    where: {
      [Op.or]: [
        {
          name: {
            [Op.like]: '%'.concat(searched).concat('%'),
          },
        },
        {
          username: {
            [Op.like]: '%'.concat(searched).concat('%'),
          },
        },
      ],
    },
  });
  const publicationsList = await ctx.orm.publication.findAll({
    where: {
      [Op.or]: [
        {
          title: {
            [Op.like]: '%'.concat(searched).concat('%'),
          },
        },
        {
          description: {
            [Op.like]: '%'.concat(searched).concat('%'),
          },
        },
        {
          category: {
            [Op.like]: '%'.concat(category).concat('%'),
          },
        },
      ],
    },
  });

  switch (ctx.accepts(["json", "html"])) {
    case "json":
      ctx.body = {
        groupsList,
        usersList,
        publicationsList,
      };
      break;
    case "html":
      await ctx.render('search/index', {
        groupsList,
        usersList,
        publicationsList,
      });
      break;
    default:
      break;
  }
});

module.exports = router;
