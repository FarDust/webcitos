

const faker = require('faker');
// eslint-disable-line import/no-extraneous-dependencies
module.exports = {
  up: queryInterface => queryInterface
    .bulkInsert(
      'users',
      Array(20).fill(undefined).map(() => ({
        name: faker.name.findName(),
        email: faker.internet.email(),
        // password: faker.internet.password(),
        password: '123web',
        phone: faker.phone.phoneNumber(),
        createdAt: faker.date.past(0.5, new Date(2017, 0, 1)),
        updatedAt: faker.date.past(0.5, new Date(2018, 0, 1)),
      })),
    ),
  down: queryInterface => queryInterface.bulkDelete('users', null, {}),
};
