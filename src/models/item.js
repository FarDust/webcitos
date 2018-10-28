
module.exports = (sequelize, DataTypes) => {
  const item = sequelize.define('item', {
    model: DataTypes.STRING,
    brand: DataTypes.STRING,
    aditional: DataTypes.STRING,
    state: DataTypes.STRING,
    category: DataTypes.STRING,
    screenSize: DataTypes.FLOAT,
    publication_id: DataTypes.INTEGER,
    image: DataTypes.STRING,
  }, {});
  item.associate = function (models) {
    // associations can be defined here
    item.belongsTo(models.publication, {
      foreignKey: 'publication_id', target: 'id',
    });
  };
  return item;
};
