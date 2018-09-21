'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn(
        'requests',
        'publication_id',
        {
          type: Sequelize.INTEGER
        }
      ),
      queryInterface.addColumn(
        'requests',
        'userID',
        {
          type: Sequelize.INTEGER
        }
      )
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('requests', 'publication_id'),
      queryInterface.removeColumn('requests', 'userID')
    ];
  }
};
