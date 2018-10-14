

module.exports = {
  up: (queryInterface, Sequelize) => [
    queryInterface.addColumn(
      'reviews',
      'trade_id',
      {
        type: Sequelize.INTEGER,
      },
    )],

  down: (queryInterface, Sequelize) => [
    queryInterface.removeColumn('reviews', 'trade_id')],
};
