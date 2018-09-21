'use strict';
module.exports = (sequelize, DataTypes) => {
  const publication = sequelize.define('publication', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    state: DataTypes.STRING,
    userID: DataTypes.INTEGER,
  }, {});
  publication.associate = function(models) {
    // associations can be defined here
    publication.hasOne(models.item);
    publication.hasMany(models.request);
    publication.belongsTo(models.user, {
      foreingKey: {
        allowNull:false
      }
    });
  };
  return publication;
};
