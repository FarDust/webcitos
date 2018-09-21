'use strict';

function* idMaker() {
	    var index = 0;
	    while(true)
	        yield index++;
	}

	var gen = idMaker();

const faker = require('faker');
module.exports = {
  up: queryInterface => queryInterface
    .bulkInsert(
      'items',
        Array(20).fill(undefined).map(() => ({
          model: faker.company.catchPhrase(),
          brand: faker.company.companyName(),
          aditional: faker.lorem.sentence(),
          state: 'Brand New',
          category: faker.company.companySuffix(),
          screenSize: Math.floor(Math.random() * (650 - 40) + 40) / 10 ,
          publication_id: gen.next().value,
          createdAt: faker.date.past(0.5, new Date(2017, 0, 1)),
          updatedAt: faker.date.past(0.5, new Date(2018, 0, 1)),
      })),
    ),

  down: queryInterface => queryInterface.bulkDelete('items', null, {}),
};
