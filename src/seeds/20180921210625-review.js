

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('reviews', [{
    content: "Given it was a gift I can't be picky about this MP4 player. It works just fine though, thanks!",
    quality_offered: 4,
    puntuality: 5,
    fullfillment_offer: 5,
    trade_id: 1,
    createdAt: new Date(2018, 6, 8),
    updatedAt: new Date(2018, 6, 8),
  }], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('reviews', null, {}),
};
