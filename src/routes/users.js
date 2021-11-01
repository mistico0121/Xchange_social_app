const KoaRouter = require('koa-router');
const fs = require('fs');
const path = require("path");
const fileStorage = require('../services/file-storage');

const router = new KoaRouter();

const sendRegisterEmail = require('../mailers/register');

async function loadUser(ctx, next) {
  ctx.state.user = await ctx.orm.user.findByPk(ctx.params.id);
  return next();
}


router.get('user.new', '/register', async (ctx) => {
  const user = ctx.orm.user.build();
  await ctx.render('users/register', {
    user,
    submitUserPath: ctx.router.url('users.create'),
  });

});


router.get('users.list', '/', async (ctx) => {
  const usersList = await ctx.orm.user.findAll();

  await ctx.render('users/index',{
    usersList,
  });
});

/*


//FUERON MOVIDOS A SESSION PARA SEPARAR USUARIO Y SUS VISTAS DE LOGINS Y SESIONES

router.get('sign_in', '/sign_in', async (ctx) => {
  await ctx.render('users/sign_in');
});*/



router.get('showUser', '/:username', async (ctx) => {

  const usersList = await ctx.orm.user.findAll();

  const user = await ctx.orm.user.findOne({
    where: {
      username: ctx.params.username
    },
  });

  const userGroupPairs = await ctx.orm.grupoUser.findAll({ where: { userId: user.id } });
  const groups = await ctx.orm.group.findAll();

  const publicationsList = await ctx.orm.publication.findAll({ where: { userId: user.id } });
  const reviewsList = await ctx.orm.review.findAll({ where: { reviewed_id: user.id } });

  if(user != null) {
    //Found user, display its profile page.
    const userId = user.id;
    const username = user.username;
    const email = user.email;
    const userRealName = user.name;
    const phone = user.phone;
    const userAddress = user.address;
    const userImageUrl = user.image_url;


    let userRating = 0;
    for (let review of reviewsList) {
      userRating += review.puntaje;
    }
    if (userRating !== 0) {
      userRating= userRating/reviewsList.length;
      userRating = userRating*20 //100 OVER 5.
    } else {
      userRating = "No hay rating";
    }
    await ctx.render('users/profile', {
      getPublicationsPath: (publications) => ctx.router.url('publications.show', { id: publications.id }),
      reviewsList,
      userGroupPairs,
      groups,
      publicationsList,
      usersList,
      userId,
      username,
      email,
      userRealName,
      phone,
      userImageUrl,
      userAddress,
      newReviewPath: ctx.router.url('reviews.new', {query: {userId: user.id}}),
      uploadUserPath: ctx.router.url("users.upload",{id:user.id}),
      userRating: userRating,
    });
  } else {
    //user not found.

    const usersList = await ctx.orm.user.findAll();

    await ctx.render('users/index',{
      usersList,
      uploadUserPath: ctx.router.url("users.upload",{id:user.id}),

    });
  }
});


router.post('users.create', '/', async (ctx) => {
  const user = ctx.orm.user.build(ctx.request.body);
  try {
    await user.save({ fields: ['username',"name", 'email', 'password', "phone", "address", "image_url"] });
    await sendRegisterEmail(ctx, user.dataValues);
    ctx.redirect(ctx.router.url('groups.list'));
  } catch (validationError) {
    console.log(validationError);
    await ctx.render(ctx.router.url("user.new"), {
      user,
      errors: validationError.errors,
      submitUserPath: ctx.router.url('user.create'),
    });
  }
});


router.get('users.upload', '/:id/upload', loadUser,async (ctx) => {
    const { user } = ctx.state;

  await ctx.render('users/upload', {
    user,
    submitImgUserPath: ctx.router.url('users.load',{id: user.id}),
  });
});


router.post("users.load","/:id/upload", loadUser, async (ctx) => {
  const { user } = ctx.state;
  const {list} = ctx.request.files;

  try{
    console.log(list.name);
    var extension = path.extname(list.name);
    let name = user.id;

    list.name = "user".concat(name,"_ava", extension);

    console.log("por ultimo aca");


    console.log(list.name);

    await fileStorage.upload(list);
    await user.update({
        image_url: 'https://iic2513-groupimgs.s3.us-east-2.amazonaws.com/'.concat(list.name)
      });


    ctx.redirect(ctx.router.url('showUser',{username: user.username}));

  }catch (validationError) {
    await ctx.render('users/upload', {
      user,
      errors: validationError.errors,
      submitImgUserPath: ctx.router.url('users.load',{id: user.id}),
      uploadUserPath: ctx.router.url("users.upload",{id:user.id}),
    });
  }
});



module.exports = router;
