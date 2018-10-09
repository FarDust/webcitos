'use strict';
module.exports = (sequelize, DataTypes) => {
  const request = sequelize.define('request', {
    message: DataTypes.STRING,
    item_offered_id: DataTypes.INTEGER,
    publication_id: DataTypes.INTEGER,
    userID: DataTypes.INTEGER,
  }, {});
  request.associate = function(models) {
    // associations can be defined here
    request.belongsTo(models.publication, {
      foreignKey: 'publication_id', target: 'id'
    });
    request.belongsTo(models.user, {
      foreignKey: 'userID', target: 'id'
    });
    request.belongsTo(models.item, {
      foreignKey: 'item_offered_id', target: 'id'
    });
    request.hasOne(models.trade, {
      foreignKey: 'id_request', sourceKey: 'id'
    });
  };
  return request;
};
