'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  /* !!! need to change !!!*/
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      username: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nickname: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('Users');
  },
};
