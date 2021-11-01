const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.post('comments.create',"/new", async (ctx)=> {
  let publicationId = '';
  let ofertaId = '';
  let comments = '';
  switch (ctx.accepts(["json", "html"])) {
    case "json":
      publicationId = JSON.parse(ctx.request.body)["publicationId"];
      ofertaId = JSON.parse(ctx.request.body)["ofertumId"];
      comments = ctx.orm.comment.build(JSON.parse(ctx.request.body));
      //SI FALLA
      try{
        await comments.save({fields: ["comment_text", "userId", "publicationId","ofertumId"]});
        const user = await ctx.orm.user.findOne({where:{id:comments.userId}});
        ctx.body = {
          iscorrect: true,
          comment_posted: [comments, user]
        };

      } catch(validationError){

        ctx.body = {
          iscorrect: false,
          error: validationError
        };

      }
      break;
    case "html":
      publicationId = ctx.request.body["publicationId"];
      ofertaId = ctx.request.body["ofertumId"];
      comments = ctx.orm.comment.build(ctx.request.body);
      //SI FALLA
      try{
        await comments.save({fields: ["comment_text", "userId", "publicationId", "ofertaId"]});
        ctx.redirect(ctx.router.url("publications.show", { id: publicationId }));

      } catch(validationError){
        //Error

      }
      break;
    default:
      break;
  }
});

module.exports = router;
