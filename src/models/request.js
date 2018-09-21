'use strict';
module.exports = (sequelize, DataTypes) => {
  const request = sequelize.define('request', {
    message: DataTypes.STRING
  }, {});
  request.associate = function(models) {
    // associations can be defined here
  };
  return request;
};