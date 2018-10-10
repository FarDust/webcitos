'use strict';
module.exports = (sequelize, DataTypes) => {
  const trade = sequelize.define('trade', {
    id_request: DataTypes.INTEGER,
    state: DataTypes.STRING
  }, {});
  trade.associate = function(models) {
    trade.belongsTo(models.request, {
      foreignKey: 'id_request', target: 'id'
    });
    trade.hasOne(models.review, {
      foreignKey: 'trade_id', sourceKey: 'id'
    });
  };
  return trade;
};
