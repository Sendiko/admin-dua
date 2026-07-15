'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bap', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      tanggal: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      jam_masuk: {
        type: Sequelize.TIME,
        allowNull: false
      },
      jam_keluar: {
        type: Sequelize.TIME,
        allowNull: false
      },
      jumlah_jam: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      deskripsi_pekerjaan: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      paraf: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0
      },
      type: {
        type: Sequelize.ENUM('pelayanan', 'pengecekan', 'maintenance', 'lainnya'),
        allowNull: false
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
      id_user: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'User',
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
    await queryInterface.dropTable('Bap');
  }
};
