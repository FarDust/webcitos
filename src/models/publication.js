'use strict';
module.exports = (sequelize, DataTypes) => {
  const publication = sequelize.define('publication', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Title required',
        },
        len: {
          args: [5],
          msg: 'Title has to be at least 5 characters long',
        },
      },
    },
    description: DataTypes.TEXT,
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [[ "gift", "exchange", "inventary" ]],
      },
    },
    userID: DataTypes.INTEGER
  }, {});
  publication.associate = function(models) {
    // associations can be defined here
    publication.belongsTo(models.user,{
      foreignKey: 'userID',
      target: 'id'
    });
    publication.hasOne(models.item, {
      foreignKey: 'publication_id',
      sourceKey: 'id'
    })
    publication.hasMany(models.request, {
      foreignKey: 'publication_id',
      sourceKey: 'id'
    })
  };
  return publication;
};
