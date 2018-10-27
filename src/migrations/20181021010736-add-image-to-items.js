module.exports = {
  up: (queryInterface, Sequelize) => [
    queryInterface.addColumn(
      'items',
      'image',
      {
        type: Sequelize.STRING,
      },
    )],

  down: (queryInterface, Sequelize) => [
    queryInterface.removeColumn('items', 'image')],
};
