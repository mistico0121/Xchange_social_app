const KoaRouter = require('koa-router');
const fs = require('fs');
const path = require("path");
const fileStorage = require('../services/file-storage');

const router = new KoaRouter();

//BASADO EN CODIGO DE PROYECTO MY UNIVERSITY

async function loadPublications(ctx, next) {
  ctx.state.publications = await ctx.orm.publication.findByPk(ctx.params.id);
  return next();
}

router.get('publications.list','/',async(ctx)=>{
	//OBTENER LISTA DE PUBLICACIONES
	const publicationsList = await ctx.orm.publication.findAll();
	//RENDEREAR VISTA EN RUTA
	await ctx.render('publications/index', {
		publicationsList,
		newPublicationsPath: ctx.router.url('publications.new'),

    getPublicationsPath: (publications) => ctx.router.url('publications.show', { id: publications.id }),
  	editPublicationsPath: (publications) => ctx.router.url('publications.edit', { id: publications.id }),
  	deletePublicationsPath: (publications) => ctx.router.url('publications.delete', { id: publications.id }),

	});
});


/*
router.get('publications', '/', async (ctx) => {
  await ctx.render('publications/index');
});*/

router.get("publications.new", "/new", async (ctx) =>{
	const publications = ctx.orm.publication.build();
	await ctx.render("publications/new", {
		publications,
    groupId: ctx.request.query.groupId,
		submitPublicationsPath: ctx.router.url("publications.create"),
	});
});



router.post('publications.create', "/", async(ctx) => {
	const publications = ctx.orm.publication.build(ctx.request.body);

	//SI FALLA
	try{
		await publications.save({fields: ["title", "category","description", "state", "groupId", "userId", "image_url"]});
		ctx.redirect(ctx.router.url("publications.show", { id: publications.id }));
	} catch(validationError){
		await ctx.render("publications.new",{
			publications,
			errors: validationError.errors,
			submitPublicationsPath: ctx.router("publications.create"),
		});

	}
});

/*title: DataTypes.STRING,
    category: DataTypes.STRING,
    description: DataTypes.STRING,
    state*/
router.get('publications.edit', '/:id/edit', loadPublications, async (ctx) => {
  const { publications } = ctx.state;
  await ctx.render('publications/edit', {
    publications,
    groupId: undefined,
    submitPublicationsPath: ctx.router.url('publications.update', { id: publications.id }),
  });
});

router.patch('publications.update', '/:id', loadPublications, async (ctx) => {
  const { publications } = ctx.state;
  try {
    const { title, category, description , state} = ctx.request.body;
    await publications.update({ title, category, description , state });
    ctx.redirect(ctx.router.url('publications.list'));
  } catch (validationError) {
    await ctx.render('publications/edit', {
      publications,
      errors: validationError.errors,
      submitPublicationsPath: ctx.router.url('publications.update', { id: publications.id }),
    });
  }
});

router.get('publications.show','/:id', loadPublications, async(ctx)=>{
  let publications = '';
  switch (ctx.accepts(["json", "html"])) {
    case "json":
      publications = await ctx.orm.publication.findByPk(ctx.params.id);
      break;
    case "html":
      publications = ctx.state.publications;
      break;
    default:
      break;
  }
  // const { publications } = ctx.state;
  const owner = await ctx.orm.user.findOne({where:{id: publications.userId}});
  const commentsList = await ctx.orm.comment.findAll({where:{publicationId: publications.id}});
  const commentUsersPair = [];
  for (const comment of commentsList) {
    const user = await ctx.orm.user.findOne({where:{id:comment.userId}});
    commentUsersPair.push([comment, user]);
  }


  switch (ctx.accepts(["json", "html"])) {
    case "json":
      ctx.body = {
        commentUsersPair
      };
      break;
    case "html":
      try {
        const { title, category, description , state } = ctx.request.body;
        await ctx.render('publications/show',{
          getPublicationsPath: (publications) => "publications/".concat(publications.id),
          editPublicationsPath: ctx.router.url('publications.edit', { id: publications.id }),
          publishCommentPath: ctx.router.url("comments.create"),
          uploadPublicationPath: ctx.router.url("publications.upload",{id: publications.id}),
          deletePublicationsPath: (publications) => ctx.router.url('publications.delete', { id: publications.id }),
          newReportFromPublicationPath: ctx.router.url('reports.new',{query: {publicationId: publications.id}}),
          newOfertaFromPublicationPath: ctx.router.url('oferta.new',{query: {publicationId: publications.id}}),
          selfPath: ctx.router.url('publications.show', { id: publications.id }),

          owner,
          ownerName: owner.name,
          publication_id: publications.id,
          commentsList: commentsList,
          commentUsersPair: commentUsersPair,
        });
      }catch (validationError){
        if (!publications) ctx.throw(404, 'invalid publication id');
      }

      break;
    default:
      break;

  }

});

router.delete('publications.delete', '/:id', loadPublications, async (ctx) => {
  const { publications } = ctx.state;
  if(ctx.state.currentUser){
    if(ctx.state.currentUser.is_admin || (publications.userId === ctx.state.currentUser.id)){ //Add if user is owner of the post?
      await publications.destroy();
      ctx.redirect(ctx.router.url('publications.list'));
      return;
    }
  }
  ctx.redirect(ctx.router.url('index.home'));
});


router.get('publications.upload', '/:id/upload', loadPublications,async (ctx) => {
    const { publications } = ctx.state;

  await ctx.render('publications/upload', {
    publications,
    submitImgPubPath: ctx.router.url('publications.load',{id: publications.id}),
  });
});

router.post("publications.load","/:id/upload",loadPublications, async (ctx) => {
  const { publications } = ctx.state;
  const {list} = ctx.request.files;
  console.log("EL NOMBRE DE ARCHIVO ES ",list.name);


  try{
    var extension = path.extname(list.name);
    let name = publications.id;

    list.name = "publication".concat(name,"_ava", extension);

    console.log("EL NOMBRE A SUBIR ES ",list.name);


    console.log(list.name);

    await fileStorage.upload(list);
    await publications.update({
        image_url: 'https://iic2513-groupimgs.s3.us-east-2.amazonaws.com/'.concat(list.name)
      });

    ctx.redirect(ctx.router.url('publications.show',{id: publications.id}));

  }catch (validationError) {
    await ctx.render('publications/upload', {
      publications,
      errors: validationError.errors,
      submitImgPubPath: ctx.router.url('publications.load',{id: publications.id}),
      uploadPublicationPath: ctx.router.url("publications.upload",{id: publications.id}),
    });
  }
});


module.exports = router;
