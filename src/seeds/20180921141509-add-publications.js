

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('publications', [{
    title: 'Nintendo DS for trade!!',
    description: 'Looking for something else that might entertain me.',
    state: 'exchange',
    userID: 1,
    createdAt: new Date(2018, 0, 1),
    updatedAt: new Date(2018, 0, 2),
  },
  {
    title: 'Trading Iphone 4',
    description: "Don't feel like using an Iphone anymore, looking for an android.",
    state: 'exchange',
    userID: 2,
    createdAt: new Date(2018, 1, 1),
    updatedAt: new Date(2018, 1, 2),
  },
  {
    title: 'I trade a new Smart Watch',
    description: 'Received it as a gift for my birthday last year but I never used it, bring in the offerings!',
    state: 'exchange',
    userID: 3,
    createdAt: new Date(2018, 2, 1),
    updatedAt: new Date(2018, 2, 2),
  },
  {
    title: 'Trade my old PSP',
    description: "Had fun with it back in the day but now I'm open to trade it for something else!",
    state: 'exchange',
    userID: 4,
    createdAt: new Date(2018, 3, 1),
    updatedAt: new Date(2018, 3, 2),
  },
  {
    title: 'Trading a Portable DVD TV Player',
    description: "It's quite old, I'm open to any offerings.",
    state: 'exchange',
    userID: 5,
    createdAt: new Date(2018, 4, 1),
    updatedAt: new Date(2018, 4, 2),
  },
  {
    title: 'Classic Tamagotchi for gift',
    description: "Found this in my old bedroom, figured I'm too old to play with it so I'm giving it away! Hope it makes some kid out there happy.",
    state: 'pendent',
    userID: 6,
    createdAt: new Date(2018, 5, 1),
    updatedAt: new Date(2018, 5, 2),
  },
  {
    title: 'Who wants my old MP4?',
    description: 'I do not use it anymore, I am giving it away while it still works.',
    state: 'inventary',
    userID: 7,
    createdAt: new Date(2018, 6, 1),
    updatedAt: new Date(2018, 6, 2),
  }], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('publications', null, {}),
};
