'use strict';
module.exports = (sequelize, DataTypes) => {
  const review = sequelize.define('review', {
    fullfillment_offer: DataTypes.INTEGER,
    quality_offered: DataTypes.INTEGER,
    puntuality: DataTypes.INTEGER,
    content: DataTypes.STRING,
  }, {});
  review.associate = function(models) {
    review.belongsTo(models.trade, {
      foreignKey: 'trade_id', target: 'id'
    })
  };
  return review;
};
