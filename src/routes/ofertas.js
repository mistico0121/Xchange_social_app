const KoaRouter =  require("koa-router");
const fs = require('fs');
const path = require("path");
const router = new KoaRouter();

//BASADO EN CODIGO DE PROYECTO MY UNIVERSITY

async function loadOferta(ctx, next) {
  ctx.state.oferta = await ctx.orm.oferta.findByPk(ctx.params.id);
  return next();
}

router.get('ofertas.list','/',async(ctx)=>{
  const ofertasList = await ctx.orm.oferta.findAll();
  const userList = await ctx.orm.user.findAll();
  //RENDEREAR VISTA EN RUTA
  await ctx.render('ofertas/index', {
    ofertasList,
    userList,
    newOfertaPath: ctx.router.url('oferta.new'),
    //editOfertaPath: (review) => ctx.router.url('oferta.edit', { id: oferta.id }),
    //deleteOfertaPath: (review) => ctx.router.url('oferta.delete', { id: oferta.id }),

  });
});

router.get('ofertas.mylist','/myoffers',async(ctx)=>{
  const ofertasList = await ctx.orm.oferta.findAll({where:{userId: ctx.state.currentUser.id}});
  const userList = await ctx.orm.user.findAll();
  const publicationList = await ctx.orm.publication.findAll();

  //RENDEREAR VISTA EN RUTA
  await ctx.render('ofertas/myOffers', {
    ofertasList,
    userList,
    publicationList,
    newOfertaPath: ctx.router.url('oferta.new'),
    //editOfertaPath: (review) => ctx.router.url('oferta.edit', { id: oferta.id }),
    //deleteOfertaPath: (review) => ctx.router.url('oferta.delete', { id: oferta.id }),

  });
});

router.get('ofertas.tome','/receivedoffers',async(ctx)=>{
  const ofertasList = await ctx.orm.oferta.findAll();
  const userList = await ctx.orm.user.findAll();
  const publicationList = await ctx.orm.publication.findAll({where:{userId: ctx.state.currentUser.id}});
  //RENDEREAR VISTA EN RUTA
  await ctx.render('ofertas/receivedOffers', {
    ofertasList,
    userList,
    publicationList,
    newOfertaPath: ctx.router.url('oferta.new'),
    //editOfertaPath: (review) => ctx.router.url('oferta.edit', { id: oferta.id }),
    //deleteOfertaPath: (review) => ctx.router.url('oferta.delete', { id: oferta.id }),

  });
});


router.get("oferta.new", "/new", async (ctx) =>{
  const oferta = ctx.orm.oferta.build();
  const publicationId = await ctx.request.query.publicationId;
  const publication = await ctx.orm.publication.findByPk(publicationId);

  await ctx.render("ofertas/new", {
    oferta,
    publicationId,
    publication,
    submitOfertaPath: ctx.router.url("oferta.create"),
  });
});


router.post('oferta.create', "/", async(ctx) => {
  const oferta = ctx.orm.oferta.build(ctx.request.body);

  //SI FALLA
  try{
    await oferta.save({fields: ["userId", "publicationId","mensaje"]});
    ctx.redirect(ctx.router.url("oferta.show", { id: oferta.id }));
  } catch(validationError){
    const publication = ctx.orm.publication.findOne({where:{id:ctx.params.publicationId}});
    await ctx.render("ofertas/new",{
      oferta,
      publication,
      publicationId: publication.id,
      errors: validationError.errors,
      submitOfertaPath: ctx.router.url("oferta.create"),
    });

  }
});

router.get('oferta.show','/:id', loadOferta, async(ctx)=>{

  let oferta = '';
  switch (ctx.accepts(["json", "html"])) {
    case "json":
      oferta = await ctx.orm.oferta.findByPk(ctx.params.id);
      break;
    case "html":
      oferta = ctx.state.oferta;
      break;
    default:
      break;
  }

  // const { publications } = ctx.state;
  const commentsList = await ctx.orm.ofertacomment.findAll({where:{ofertumId: oferta.id}});
  const commentUsersPair = [];
  for (const comment of commentsList) {
    const user = await ctx.orm.user.findOne({where:{id:comment.userId}});
    commentUsersPair.push([comment, user]);
  }

  const publication = await ctx.orm.publication.findByPk(oferta.publicationId);
  const owner = await ctx.orm.user.findByPk(publication.userId);
  const ofertante = await ctx.orm.user.findByPk(oferta.userId);

  //SOLO PUEDE ENTRAR SI ES EL DUEÑO U OFERTANTE
  if (ctx.state.currentUser.id == publication.userId || ctx.state.currentUser.id == oferta.userId){

    switch (ctx.accepts(["json", "html"])) {
        case "json":
          ctx.body = {
            commentUsersPair
          };
          break;
        case "html":
          try {

            await ctx.render('ofertas/show',{
              owner,
              publication,
              ofertante,
              publishCommentPath: ctx.router.url("ofertacomments.create"),
              selfPath: ctx.router.url('oferta.show', { id: oferta.id }),

              ownerName: owner.name,
              offer_id: oferta.id,
              ownerName: owner.name,
              publication_id: publication.id,
              commentsList: commentsList,
              commentUsersPair: commentUsersPair,

            });
          }catch (validationError){
            if (!oferta) ctx.throw(404, 'invalid offer id');
          }

          break;
        default:
          break;

      }









  } else {
    ctx.redirect("/");
  }
});


/*
router.get('reviews.edit', '/:id/edit', loadReview, async (ctx) => {
  const { review } = ctx.state;
  await ctx.render('reviews/edit', {
    review,
    submitReviewPath: ctx.router.url('reviews.update', { id: review.id }),
  });
});

router.patch('reviews.update', '/:id', loadReview, async (ctx) => {
  const { review } = ctx.state;
  try {
    const { puntaje, text} = ctx.request.body;
    await review.update({ puntaje, text });
    ctx.redirect(ctx.router.url('reviews.list'));
  } catch (validationError) {
    await ctx.render('reviews/edit', {
      review,
      errors: validationError.errors,
      submitReviewPath: ctx.router.url('reviews.update', { id: review.id }),
    });
  }
});



router.del('reviews.delete', '/:id', loadReview, async (ctx) => {
  const { review } = ctx.state;
  await review.destroy();
  ctx.redirect(ctx.router.url('reviews.list'));
});
*/

module.exports = router;
