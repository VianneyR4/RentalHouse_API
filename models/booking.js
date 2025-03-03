'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.Property, {
        foreignKey: 'propertyId',
        as: 'property',
      });
      Booking.belongsTo(models.User, { 
        foreignKey: 'renterId', 
        as: 'Renter' 
      });
      Booking.belongsTo(models.User, { foreignKey: 'hostId', as: 'Host' });
    }
  }
  Booking.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true,
      },
      propertyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      renterId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      hostId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      checkIn: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      checkOut: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      datesArray: {
        type: DataTypes.JSON, // Use JSON to store the array of dates
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'canceled'),
        defaultValue: 'pending',
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Booking',
      timestamps: true,
    }
  );
  return Booking;
};