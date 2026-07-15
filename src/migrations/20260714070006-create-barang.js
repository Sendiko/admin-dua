'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Barang', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      nama: {
        type: Sequelize.STRING,
        allowNull: false
      },
      jumlah: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      status: {
        type: Sequelize.ENUM('Baik', 'Rusak Ringan', 'Rusak Berat'),
        allowNull: false,
        defaultValue: 'Baik'
      },
      id_laboratorium: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Laboratorium',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      id_lokasi: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Lokasi',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      id_kategori: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Kategori',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Barang');
  }
};
