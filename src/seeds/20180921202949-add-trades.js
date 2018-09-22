'use strict';

function* idMaker() {
      var index = 1;
      while(true)
          yield index++;
  }

var gen = idMaker();

const faker = require('faker');

module.exports = {
  up: queryInterface => queryInterface
    .bulkInsert(
      'trades',
      Array(10).fill(undefined).map(() => ({
        id_request: gen.next().value,
        state: 'not_concreted',
        createdAt: faker.date.past(0.5, new Date(2017, 0, 1)),
        updatedAt: faker.date.past(0.5, new Date(2018, 0, 1)),
      })),
    ),
  down: queryInterface => queryInterface.bulkDelete('users', null, {}),
};