const KoaRouter = require('koa-router');
const fs = require('fs');
const path = require("path");
const fileStorage = require('../services/file-storage');

const router = new KoaRouter();

async function loadGroup(ctx, next) {
  ctx.state.group = await ctx.orm.group.findByPk(ctx.params.id);
  return next();
}


router.get('groups.list', '/', async (ctx) => {
  const groupsList = await ctx.orm.group.findAll();
  await ctx.render('groups/index',{
    groupsList,
    getGroupPath: (group) => "".concat(group.id),
    editGroupPath: (group) => "".concat(group.id).concat("/edit"),
    deleteGroupPath: (group) => ctx.router.url('groups.delete', { id: group.id })
  });
});

router.get('group.new', '/new', async (ctx) => {
  const group = ctx.orm.group.build();
  await ctx.render('groups/new', {
    group,
    submitGroupPath: ctx.router.url('groups.create'),
  });

});


router.del('groups.delete', '/:id', loadGroup, async (ctx) => {
  if(ctx.state.currentUser){
    if(ctx.state.currentUser.is_admin){ //Add if user is owner of the post?
      const { group } = ctx.state;
      await group.destroy();
    }
  }
  ctx.redirect(ctx.router.url('index.home'));
});


router.post('groups.create', '/', async (ctx) => {
  const group = ctx.orm.group.build(ctx.request.body);

  try {
    await group.save({ fields: ['id', 'name', 'image', 'description', "userId", "image_url"] });
    await ctx.orm.grupoUser.create({ userId: ctx.session.userId, groupId: group.id });

    ctx.redirect(ctx.router.url("groups.show", {id: group.id}));

  } catch (validationError) {
    await ctx.render('groups/new', {
      group,
      errors: validationError.errors,
      submitGroupPath: ctx.router.url('groups.create'),
    });
  }
});

router.get('groups.edit', '/:id/edit', loadGroup, async (ctx) => {
  const { group } = ctx.state;
  await ctx.render('groups/edit', {
    group,
    submitGroupPath: ctx.router.url('groups.update', { id: group.id }),
  });
});

router.patch('groups.update', '/:id', loadGroup, async (ctx) => {
  const { group } = ctx.state;
  try {
    const { name, description, image } = ctx.request.body;
    await group.update({ name, description, image });
    ctx.redirect("/");
  } catch (validationError) {
    await ctx.render('groups/edit', {
      group,
      errors: validationError.errors,
      submitGroupPath: ctx.router.url('groups.update', { id: group.id }),
    });
  }
});



router.get('group.addUser', '/:id/addUser', loadGroup, async (ctx) => {
  console.log("awawa");

  const { group } = ctx.state;
  console.log("group id es" , group.id);
  await ctx.render('groups/fromUserToGroup', {
    group,
    addUserToGroup: ctx.router.url('groups.addToGroup',{ id: group.id }),
  });

});

router.post('groups.addToGroup','/:id/addUser', loadGroup, async(ctx) =>{
  const {group} = ctx.state;

  console.log("oyeeeeeee");
  const grupoUser = ctx.orm.grupoUser.build(ctx.request.body);

  try{
    await grupoUser.save({ fields: ['userId', 'groupId']});

    console.log("holoooooo");
    ctx.redirect(ctx.router.url("groups.show", {id: group.id}));

  }catch(validationError){

    await ctx.render('groups/show', {
      group,
      errors: validationError.errors,
      submitGroupPath: ctx.router.url('groups.show', { id: group.id }),
    });

  }
})



router.get('groups.upload', '/:id/upload', loadGroup,async (ctx) => {
    const { group } = ctx.state;

  await ctx.render('groups/upload', {
    group,
    submitImgPath: ctx.router.url('groups.load',{id: group.id}),
  });
});


router.post("groups.load","/:id/upload",loadGroup, async (ctx) => {
  const { group } = ctx.state;
  const {list} = ctx.request.files;


  try{
    var extension = path.extname(list.name);
    let name = group.id;

    list.name = "group".concat(name,"_ava", extension);

    console.log(list.name);

    await fileStorage.upload(list);
    await group.update({
        image_url: 'https://iic2513-groupimgs.s3.us-east-2.amazonaws.com/'.concat(list.name)
      });

    ctx.redirect(ctx.router.url('groups.show',{id: group.id}));

  }catch (validationError) {
    await ctx.render('groups/upload', {
      group,
      errors: validationError.errors,
      submitImgPath: ctx.router.url('groups.load',{id: group.id}),
      uploadGroupPath: ctx.router.url("groups.upload",{id:group.id}),
    });
  }
});



router.get('groups.show','/:id', loadGroup, async(ctx)=>{
  const { group } = ctx.state;

  const publicationsList = await ctx.orm.publication.findAll({ where: { groupId: group.id } });
  const userGroupPairs = await ctx.orm.grupoUser.findAll({ where: { groupId: group.id } });
  const users = await ctx.orm.user.findAll();
  let testUserIn;
  let userInGroup = false;


  //DEFINIENDO BOOL QUE INDICA SI EL CURRENT USER SE ENCUENTRA EN EL GRUPO
  //LOS MALABARES SON PARA QUE NO CRASHEE CUANDO NO EXISTE CURRENT USER
  if (ctx.state.currentUser){
    testUserIn = await ctx.orm.grupoUser.findAll({ where: { groupId: group.id, userId: ctx.state.currentUser.id} });
  }
  if (ctx.state.currentUser){
    if (testUserIn.length > 0){
      userInGroup = true;
    }
  }


  try {
    const { name, description, image } = ctx.request.body;
    await ctx.render('groups/show',{
      userInGroup,
      publicationsList,
      userGroupPairs,
      users,
      isGroupOwner: true,
      getGroupPath: (group) => "groups/".concat(group.id),
      newPublicationsFromGroupPath: ctx.router.url('publications.new',{query: {groupId: group.id}}),
      addUserToThisGroup: ctx.router.url('group.addUser',{ id: group.id }),
      getPublicationsPath: (publications) => ctx.router.url('publications.show', { id: publications.id }),
      editPublicationsPath: (publications) => ctx.router.url('publications.edit', { id: publications.id }),
      deletePublicationsPath: (publications) => ctx.router.url('publications.delete', { id: publications.id }),
      deleteGroupPath: ctx.router.url("groups.delete",{id: group.id}),
      uploadGroupPath: ctx.router.url("groups.upload",{id: group.id}),


    });
  }catch (validationError){
    if (!group) ctx.throw(404, 'invalid group id');
  }
});



// router.del('groups.delete', '/:id', loadGroup, async (ctx) => {
//   const { group } = ctx.state;
//   await group.destroy();
//   ctx.redirect("/");
// });



module.exports = router;
