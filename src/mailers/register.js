module.exports = function sendRegisterEmail(ctx, user) {
  // you can get all the additional data needed by using the provided one plus ctx
  const email = user.email;
  console.log("Sending email to: '"+email+"'");
  return ctx.sendMail('register-mail', { to: email, subject: "Bienvenido a XChange!"}, {user});
};
