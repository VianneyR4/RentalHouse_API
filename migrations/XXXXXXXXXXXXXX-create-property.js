'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create ENUM types first
    await queryInterface.sequelize.query(
      'CREATE TYPE enum_Properties_purpose AS ENUM (\'Buy\', \'Rent\');'
    ).catch(err => {
      console.log('Note: ENUM type might already exist');
    });

    await queryInterface.sequelize.query(
      'CREATE TYPE enum_Properties_type AS ENUM (\'House\', \'Apartment\', \'Villa\');'
    ).catch(err => {
      console.log('Note: ENUM type might already exist');
    });

    await queryInterface.createTable('Properties', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      beds: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      baths: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      size: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pricePerNight: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      hostId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      images: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      purpose: {
        type: Sequelize.ENUM('Buy', 'Rent'),
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('House', 'Apartment', 'Villa'),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Properties');
    
    // Drop ENUM types
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS enum_Properties_purpose;'
    ).catch(err => {
      console.log('Note: ENUM type might not exist');
    });

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS enum_Properties_type;'
    ).catch(err => {
      console.log('Note: ENUM type might not exist');
    });
  }
}; 