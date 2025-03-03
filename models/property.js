'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Property extends Model {
    static associate(models) {
      Property.belongsTo(models.User, {
        foreignKey: 'hostId',
        as: 'host',
      });
      Property.hasMany(models.Booking, {
        foreignKey: 'propertyId',
        as: 'bookings',
      });
    }
  }

  Property.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    beds: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    baths: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pricePerNight: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hostId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    images: {
      type: DataTypes.JSON, // Changed from ARRAY to JSON for MySQL compatibility
      allowNull: true,
    },
    purpose: {
      type: DataTypes.ENUM('Buy', 'Rent'),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('House', 'Apartment', 'Villa'),
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Property',
    timestamps: true,
  });

  return Property;
};