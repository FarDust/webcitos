'use strict';

const faker = require('faker');
module.exports = {
  up: queryInterface => queryInterface
    .bulkInsert(
      'publications',
        Array(20).fill(undefined).map(() => ({
        title: faker.name.title(),
        description: faker.lorem.sentence(),
        state: "active",
        userID: Math.floor(Math.random() * 21),
        createdAt: faker.date.past(0.5, new Date(2017, 0, 1)),
        updatedAt: faker.date.past(0.5, new Date(2018, 0, 1)),
      })),
    ),

  down: queryInterface => queryInterface.bulkDelete('publications', null, {}),
};
