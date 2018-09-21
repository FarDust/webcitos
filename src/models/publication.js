'use strict';
module.exports = (sequelize, DataTypes) => {
  const publication = sequelize.define('publication', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    state: DataTypes.STRING,
    publication_date: DataTypes.DATE
  }, {});
  publication.associate = function(models) {
    // associations can be defined here
  };
  return publication;
};
