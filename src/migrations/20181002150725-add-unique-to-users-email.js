module.exports = {
  up(queryInterface) {
    return queryInterface.addConstraint('users', ['email'], {
      type: 'unique',
      name: 'unique-email',
    });
  },
  down(queryInterface) {
    return queryInterface.removeConstraint('users', 'unique-email');
  },
};