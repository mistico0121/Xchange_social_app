const KoaRouter =  require("koa-router");

const router = new KoaRouter();

//BASADO EN CODIGO DE PROYECTO MY UNIVERSITY

async function loadReports(ctx, next) {
  ctx.state.reports = await ctx.orm.report.findByPk(ctx.params.id);
  return next();
}

router.get('reports.list','/',async(ctx)=>{
	//OBTENER LISTA DE PUBLICACIONES
	const reportsList = await ctx.orm.report.findAll();


  const reportsUsersPair = [];
  for (const report of reportsList) {
    console.log(report.user_id);
    const user = await ctx.orm.user.findOne({where:{id:report.user_id}});
    reportsUsersPair.push([report, user]);
  }

	//RENDEREAR VISTA EN RUTA
	await ctx.render('reports/index', {
		reportsList,
    reportsUsersPair: reportsUsersPair,

		newReportsPath: ctx.router.url('reports.new'),
  	editReportsPath: (reports) => ctx.router.url('reports.edit', { id: reports.id }),
  	deleteReportsPath: (reports) => ctx.router.url('reports.delete', { id: reports.id }),

	});
});


/*
router.get('publications', '/', async (ctx) => {
  await ctx.render('publications/index');
});*/

router.get("reports.new", "/new", async (ctx) =>{
	const reports = ctx.orm.report.build();  
	await ctx.render("reports/new", {
		reports,
    publicationId: ctx.request.query.publicationId,
    publication: await ctx.orm.publication.findByPk(publicationId),
		submitReportsPath: ctx.router.url("reports.create"),
	});
});



router.post('reports.create', "/", async(ctx) => {
	const reports = ctx.orm.report.build(ctx.request.body);

	//SI FALLA
	try{
		await reports.save({fields: ["user_id", "publication_id","text"]});
		ctx.redirect(ctx.router.url("reports.list"));
	} catch(validationError){
		await ctx.render("reports.new",{
			reports,
			errors: validationError.errors,
			submitReportsPath: ctx.router("reports.create"),
		});

	}
});

/*user_id: DataTypes.INTEGER,
    publication_id: DataTypes.INTEGER,
    text: DataTypes.STRING*/
router.get('reports.edit', '/:id/edit', loadReports, async (ctx) => {
  const { reports } = ctx.state;
  await ctx.render('reports/edit', {
    reports,
    submitReportsPath: ctx.router.url('reports.update', { id: reports.id }),
  });
});

router.patch('reports.update', '/:id', loadReports, async (ctx) => {
  const { reports } = ctx.state;
  try {
    const { user_id, publication_id, text} = ctx.request.body;
    await reports.update({ user_id, publication_id, text });
    ctx.redirect(ctx.router.url('reports.list'));
  } catch (validationError) {
    await ctx.render('reports/edit', {
      reports,
      errors: validationError.errors,
      submitReportsPath: ctx.router.url('reports.update', { id: reports.id }),
    });
  }
});



router.del('reports.delete', '/:id', loadReports, async (ctx) => {
  const { reports } = ctx.state;
  await reports.destroy();
  ctx.redirect(ctx.router.url('reports.list'));
});


module.exports = router;
