'use strict';
module.exports = (sequelize, DataTypes) => {
  const item = sequelize.define('item', {
    model: DataTypes.STRING,
    brand: DataTypes.STRING,
    aditional: DataTypes.STRING,
    state: DataTypes.STRING,
    category: DataTypes.STRING,
    screen_size: DataTypes.FLOAT
  }, {});
  item.associate = function(models) {
    // associations can be defined here
  };
  return item;
};