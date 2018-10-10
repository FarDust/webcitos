'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    phone: DataTypes.STRING,
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Name required',
        },
        len: {
          args: [2],
          msg: 'Name has to be at least 2 characters long',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'This e-mail has already been used',
      },
      validate: {
        notEmpty: {
          msg: 'E-mail required',
        },
        isEmail: {
          msg: 'E-mail has to be valid',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Password required',
        },
        len: {
          args: [5],
          msg: 'Password has to be at least 5 characters long',
        },
      },
    },
  }, {});
  user.associate = function(models) {
    // associations can be defined here
    user.hasMany(models.publication, {
      foreignKey: 'userID',
      sourceKey: 'id',
    });
  };
  return user;
};
