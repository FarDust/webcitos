'use strict';
module.exports = (sequelize, DataTypes) => {
  const request = sequelize.define('request', {
    message: DataTypes.STRING
  }, {});
  request.associate = function(models) {
    // associations can be defined here
    request.belongsTo(models.publication, {
      foreignKey: 'publication_id', target: 'id'
    });
    request.belongsTo(models.user, {
      foreignKey: 'user_id', target: 'id'
    });
  };
  return request;
};
