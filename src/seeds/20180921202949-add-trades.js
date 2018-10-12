

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('trades', [{
    id_request: 6,
    state: 'concreted',
    createdAt: new Date(2018, 6, 5),
    updatedAt: new Date(2018, 6, 5),
  },
  {
    id_request: 3,
    state: 'not_concreted',
    createdAt: new Date(2018, 6, 5),
    updatedAt: new Date(2018, 6, 5),
  }], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('trades', null, {}),
};
