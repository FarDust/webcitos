
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('items', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    model: {
      type: Sequelize.STRING,
    },
    brand: {
      type: Sequelize.STRING,
    },
    aditional: {
      type: Sequelize.STRING,
    },
    state: {
      type: Sequelize.STRING,
    },
    category: {
      type: Sequelize.STRING,
    },
    screenSize: {
      type: Sequelize.FLOAT,
    },
    publication_id: {
      type: Sequelize.INTEGER,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('items'),
};
