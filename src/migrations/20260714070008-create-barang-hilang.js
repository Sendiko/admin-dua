'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BarangHilang', {
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
      lokasi_penemuan: {
        type: Sequelize.STRING,
        allowNull: false
      },
      ditemukan_oleh: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tanggal_ditemukan: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      lokasi_penyimpanan: {
        type: Sequelize.STRING,
        allowNull: false
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
    await queryInterface.dropTable('BarangHilang');
  }
};
