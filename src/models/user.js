const bcrypt = require('bcrypt');

const PASSWORD_SALT = 10; // COMPLEJIDAD DE LA SALT 2¹⁰

async function buildPasswordHash(instance) {
  // se cambia aca solo cuando usuario cambia clave
  if (instance.changed('password')) {
    const hash = await bcrypt.hash(instance.password, PASSWORD_SALT);
    instance.set('password', hash);
  }
}

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    image_url: DataTypes.STRING,
    is_admin: DataTypes.BOOLEAN,
  }, {});

  // CLAVE SE ENCRIPTA ANTES DE CREAR O ACTUALIZAR PASSWORD USUARIO
  user.beforeCreate(buildPasswordHash);
  user.beforeUpdate(buildPasswordHash);

  user.associate = function (models) {
    // associations can be defined here
    user.belongsToMany(models.group, { through: 'userGroup' });
    user.hasMany(models.chatMessage);
    user.hasMany(models.deal);
    user.hasMany(models.comment);
    user.hasMany(models.review);
    user.hasMany(models.publication);
    user.hasMany(models.item);
  };

  // METODO DISPONIBLE PARA CADA INSTANCIA DE MODELO
  user.prototype.checkPassword = function checkPassword(password) {
    return bcrypt.compare(password, this.password);
  };

  return user;
};
