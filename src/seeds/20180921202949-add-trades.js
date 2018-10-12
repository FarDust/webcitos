'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('trades', [{
        id_request: 6,
        state: 'concreted',
        createdAt: new Date(2018, 6, 5),
        updatedAt: new Date(2018, 6, 5)
      },
      {
        id_request: 3,
        state: 'pendent',
        createdAt: new Date(2018, 6, 5),
        updatedAt: new Date(2018, 6, 5)
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('trades', null, {});
  }
};
