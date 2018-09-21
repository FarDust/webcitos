'use strict';
module.exports = (sequelize, DataTypes) => {
  const publication = sequelize.define('publication', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    state: DataTypes.STRING,
    userID: DataTypes.INTEGER
  }, {});
  publication.associate = function(models) {
    // associations can be defined here
    publication.belongsTo(models.user,{
      foreignKey: 'userID', target: 'id'
    });
    publication.hasOne(models.item, {
      foreignKey: 'id'
    })
    publication.hasMany(models.request, {
      foreignKey: 'id'
    })
  };
  return publication;
};
