'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn(
        'reviews',
        'trade_id',
        {
          type: Sequelize.INTEGER
        }
      )]
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('reviews', 'trade_id')]
  }
};
