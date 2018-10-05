'use strict';

const faker = require('faker');
module.exports = {
  up: queryInterface => queryInterface
    .bulkInsert(
      'requests',
        Array(20).fill(undefined).map(() => ({
          message: faker.lorem.sentence(),
          userID: Math.floor(Math.random() * 21),
          publication_id: Math.floor(Math.random() * 21),
          createdAt: faker.date.past(0.5, new Date(2017, 0, 1)),
          updatedAt: faker.date.past(0.5, new Date(2018, 0, 1)),
      })),
    ),

  down: queryInterface => queryInterface.bulkDelete('requests', null, {}),
};