'use strict';
module.exports = (sequelize, DataTypes) => {
  const review = sequelize.define('review', {
    fullfillment_offer: DataTypes.INTEGER,
    quality_offered: DataTypes.INTEGER,
    puntuality: DataTypes.INTEGER,
    content: DataTypes.STRING,
  }, {});
  review.associate = function(models) {
    // associations can be defined here
  };
  return review;
};