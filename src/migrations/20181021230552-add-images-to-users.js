module.exports = {
  up: (queryInterface, Sequelize) => [
    queryInterface.addColumn(
      'users',
      'image',
      {
        type: Sequelize.STRING,
      },
    )],

  down: (queryInterface, Sequelize) => [
    queryInterface.removeColumn('users', 'image')],
};