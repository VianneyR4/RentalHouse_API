'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Bookings', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true,
      },
      propertyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      renterId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      hostId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      checkIn: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      checkOut: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      datesArray: {
        type: Sequelize.JSON, // Use JSON to store the array of dates
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'canceled'),
        defaultValue: 'pending',
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

  },

};