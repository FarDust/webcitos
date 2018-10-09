'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('requests', [{
        message: "It's not an android but you might like it",
        userID: 3,
        publication_id: 2,
        item_offered_id: 3,
        createdAt: new Date(2018, 2, 3),
        updatedAt: new Date(2018, 2, 3)
      },
      {
        message: "You might like playing with this if you enjoyed your Nintendo DS",
        userID: 4,
        publication_id: 1,
        item_offered_id: 4,
        createdAt: new Date(2018, 3, 3),
        updatedAt: new Date(2018, 3, 3)
      },
      {
        message: "My niece would love this toy! I want it please :)",
        userID: 10,
        publication_id: 6,
        item_offered_id: null,
        createdAt: new Date(2018, 5, 3),
        updatedAt: new Date(2018, 5, 3)
      },
      {
        message: "I'm not a kid but I want this toy pleaseee",
        userID: 11,
        publication_id: 6,
        item_offered_id: null,
        createdAt: new Date(2018, 5, 4),
        updatedAt: new Date(2018, 5, 4)
      },
      {
        message: "Can I have this?",
        userID: 12,
        publication_id: 7,
        item_offered_id: null,
        createdAt: new Date(2018, 6, 3),
        updatedAt: new Date(2018, 6, 3)
      },
      {
        message: "I want to have this!! Love listening to music while I'm jogging",
        userID: 13,
        publication_id: 7,
        item_offered_id: null,
        createdAt: new Date(2018, 6, 4),
        updatedAt: new Date(2018, 6, 4)
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('requests', null, {});
  }
};