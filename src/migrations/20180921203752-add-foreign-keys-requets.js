

module.exports = {
  up: (queryInterface, Sequelize) => [
    queryInterface.addColumn(
      'requests',
      'publication_id',
      {
        type: Sequelize.INTEGER,
      },
    ),
    queryInterface.addColumn(
      'requests',
      'userID',
      {
        type: Sequelize.INTEGER,
      },
    ),
    queryInterface.addColumn(
      'requests',
      'item_offered_id',
      {
        type: Sequelize.INTEGER,
      },
    ),
  ],

  down: (queryInterface, Sequelize) => [
    queryInterface.removeColumn('requests', 'publication_id'),
    queryInterface.removeColumn('requests', 'userID'),
  ],
};
