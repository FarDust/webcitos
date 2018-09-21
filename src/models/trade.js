'use strict';
module.exports = (sequelize, DataTypes) => {
  const trade = sequelize.define('trade', {
    id_request: DataTypes.INTEGER,
    state: DataTypes.STRING
  }, {});
  trade.associate = function(models) {
    // associations can be defined here
  };
  return trade;
};