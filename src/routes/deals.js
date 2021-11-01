const KoaRouter = require('koa-router');

const router = new KoaRouter();


router.post('publications.create', "/", async(ctx) => {
  const publications = ctx.orm.deal.build(ctx.request.body);

  //SI FALLA
  try{
    await publications.save({fields: ["date", "publicationId"]});
    ctx.redirect(ctx.router.url("publications.show", { id: publications.id }));
  } catch(validationError){
    await ctx.render("publications.new",{
      publications,
      errors: validationError.errors,
      submitPublicationsPath: ctx.router("publications.create"),
    });

  }
});

module.exports = router;
