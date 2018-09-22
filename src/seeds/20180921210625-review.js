'use strict';
const faker = require('faker');

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function* idMaker() {
      var index = 1;
      while(true)
          yield index++;
  }

var gen = idMaker();

module.exports = {
  up: queryInterface => queryInterface
    .bulkInsert(
      'reviews',
      Array(10).fill(undefined).map(() => ({
        content: faker.lorem.sentence(),
        quality_offered: getRandomInt(1,5),
        puntuality: getRandomInt(1,5),
        fullfillment_offer: getRandomInt(1,5),
        trade_id: gen.next().value,
        createdAt: faker.date.past(0.5, new Date(2017, 0, 1)),
        updatedAt: faker.date.past(0.5, new Date(2018, 0, 1)),
      })),
    ),

  down: queryInterface => queryInterface.bulkDelete('users', null, {}),
};