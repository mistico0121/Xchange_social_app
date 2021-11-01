const KoaRouter = require('koa-router');

const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtKey = process.env.JWT_KEY;
const jwtExpirySeconds = 300;

const router = new KoaRouter();


async function authenticate(ctx, next) {
  const token = ctx.cookies.get("token");
  // if the cookie is not set, return an unauthorized error
  if (!token) {
    ctx.status = 401;
    return;
  }
  return next();
}

router.get("api.username",'/username', authenticate, async (ctx) => {
  let payload;
  const token = ctx.cookies.get("token");
  try {
    // Parse the JWT string and store the result in `payload`.
    // Note that we are passing the key in this method as well. This method will throw an error
    // if the token is invalid (if it has expired according to the expiry time we set on sign in),
    // or if the signature does not match
    payload = jwt.verify(token, jwtKey);
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      ctx.status = 401;
      return;
    }
    console.log("Error"+e);
    // otherwise, return a bad request error
    ctx.status = 400;
    return;
  }

  // Finally, return the welcome message to the user, along with their
  // username given in the token
  ctx.body = payload.username;
});

router.get("api.groups",'/groups', authenticate, async (ctx) => {
  let payload;
  const token = ctx.cookies.get("token");
  try {
    // Parse the JWT string and store the result in `payload`.
    // Note that we are passing the key in this method as well. This method will throw an error
    // if the token is invalid (if it has expired according to the expiry time we set on sign in),
    // or if the signature does not match
    payload = jwt.verify(token, jwtKey);
    const response = {};
    response["groups"] = [];
    const groupsList = await ctx.orm.group.findAll();
    groupsList.forEach((group)=>{
      let groupData = {
        id: group.id,
        name: group.name,
        description: group.description,
      };
      response["groups"].push(groupData);
    });
    ctx.body = response;
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      ctx.status = 401;
      return;
    }
    console.log("Error"+e);
    // otherwise, return a bad request error
    ctx.status = 400;
  }
});


router.get("api.groupmembers",'/groups/:id/members', authenticate, async (ctx) => {
  let payload;
  const id = ctx.params.id;
  const token = ctx.cookies.get("token");
  try {
    // Parse the JWT string and store the result in `payload`.
    // Note that we are passing the key in this method as well. This method will throw an error
    // if the token is invalid (if it has expired according to the expiry time we set on sign in),
    // or if the signature does not match
    payload = jwt.verify(token, jwtKey);
    const response = {};
    response["groups"] = [];
    const group = await ctx.orm.group.findOne({where: {id: id}});

    ctx.body = response;
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      ctx.status = 401;
      return;
    }
    console.log("Error"+e);
    // otherwise, return a bad request error
    ctx.status = 400;
  }
});


router.get("api.publications",'/publications', authenticate, async (ctx) => {
  let payload;
  const id = ctx.params.id;
  const token = ctx.cookies.get("token");
  try {
    // Parse the JWT string and store the result in `payload`.
    // Note that we are passing the key in this method as well. This method will throw an error
    // if the token is invalid (if it has expired according to the expiry time we set on sign in),
    // or if the signature does not match
    payload = jwt.verify(token, jwtKey);
    const response = {};
    response["publications"] = [];
    const posts = await ctx.orm.publication.findAll();
    for (const post of posts) {
      const comments = await ctx.orm.comment.findAll({where: {publicationId: post.id}});
      const userName = await ctx.orm.user.findOne({where:{id: post.userId}});
      const postResponse = {
        id: post.id,
        owner: userName.username,
        group: post.groupId,
        title: post.title,
        description: post.description,
        category: post.category,
        state: post.state,
        comments:comments,
      };
      response["publications"].push(postResponse);
    }

    ctx.body = response;
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      ctx.status = 401;
      return;
    }
    console.log("Error"+e);
    // otherwise, return a bad request error
    ctx.status = 400;
  }
});


router.del("api.deletepublication",'/publications/:id', authenticate, async (ctx) => {
  let payload;
  const id = ctx.params.id;
  const token = ctx.cookies.get("token");
  try {
    // Parse the JWT string and store the result in `payload`.
    // Note that we are passing the key in this method as well. This method will throw an error
    // if the token is invalid (if it has expired according to the expiry time we set on sign in),
    // or if the signature does not match
    payload = jwt.verify(token, jwtKey);


    const post = await ctx.orm.publication.findOne({where:{id:id}});
    await post.destroy();
    ctx.status = 200;
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      ctx.status = 401;
      return;
    }
    console.log("Error"+e);
    // otherwise, return a bad request error
    ctx.status = 400;
  }
});


router.post("api.createpublication",'/publications/create', authenticate, async (ctx) => {
  let payload;
  const id = ctx.params.id;
  const token = ctx.cookies.get("token");
  try {
    // Parse the JWT string and store the result in `payload`.
    // Note that we are passing the key in this method as well. This method will throw an error
    // if the token is invalid (if it has expired according to the expiry time we set on sign in),
    // or if the signature does not match
    payload = jwt.verify(token, jwtKey);


    const publications = ctx.orm.publication.build(ctx.request.body);

    //SI FALLA
    try{
      await publications.save({fields: ["title", "category","description", "state", "groupId", "userId"]});
      ctx.status = 200;
    } catch(validationError){
      ctx.status = 500;
    }
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      ctx.status = 401;
      return;
    }
    console.log("Error"+e);
    // otherwise, return a bad request error
    ctx.status = 400;
  }
});

router.post("api.editpublication",'/publications/edit', authenticate, async (ctx) => {
  let payload;
  const id = ctx.params.id;
  const token = ctx.cookies.get("token");
  try {
    // Parse the JWT string and store the result in `payload`.
    // Note that we are passing the key in this method as well. This method will throw an error
    // if the token is invalid (if it has expired according to the expiry time we set on sign in),
    // or if the signature does not match
    payload = jwt.verify(token, jwtKey);


    const { publications } = ctx.state;
    try {
      const { title, category, description , state} = ctx.request.body;
      await publications.update({ title, category, description , state });
      ctx.status = 200;
    } catch (validationError) {
      ctx.status = 500;
    }

  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      ctx.status = 401;
      return;
    }
    console.log("Error"+e);
    // otherwise, return a bad request error
    ctx.status = 400;
  }
});

module.exports = router;
