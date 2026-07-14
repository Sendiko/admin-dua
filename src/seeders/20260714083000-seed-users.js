'use strict';
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Hash password manually since bulkInsert bypasses model hooks
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Retrieve Roles
    const roles = await queryInterface.sequelize.query(
      `SELECT id, nama FROM Role WHERE nama IN ('Laboran', 'Asisten')`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const laboranRole = roles.find(r => r.nama === 'Laboran');
    const asistenRole = roles.find(r => r.nama === 'Asisten');

    // Retrieve default Laboratorium (A1)
    const labs = await queryInterface.sequelize.query(
      `SELECT id, kode FROM Laboratorium WHERE kode = 'A1'`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const defaultLab = labs[0];

    if (!laboranRole || !asistenRole) {
      console.warn('⚠️ Seeding skipped: Roles "Laboran" or "Asisten" not found. Please run the roles seeder first.');
      return;
    }

    // Check existing users to prevent duplicate inserts
    const existingUsers = await queryInterface.sequelize.query(
      `SELECT username FROM User`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const existingUsernames = existingUsers.map(u => u.username);

    const usersToInsert = [];

    // Seed Laboran
    if (!existingUsernames.includes('laboran_admin')) {
      usersToInsert.push({
        id: crypto.randomUUID(),
        username: 'laboran_admin',
        email: 'laboran@admin.com',
        password: hashedPassword,
        nama_lengkap: 'Laboran Administrator',
        profileUrl: null,
        id_laboratorium: defaultLab ? defaultLab.id : null,
        id_role: laboranRole.id,
        nomor_telepon: '081234567890',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Seed Asisten
    if (!existingUsernames.includes('asisten_default')) {
      usersToInsert.push({
        id: crypto.randomUUID(),
        username: 'asisten_default',
        email: 'asisten@admin.com',
        password: hashedPassword,
        nama_lengkap: 'Default Assistant',
        profileUrl: null,
        id_laboratorium: defaultLab ? defaultLab.id : null,
        id_role: asistenRole.id,
        nomor_telepon: '081234567891',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    if (usersToInsert.length > 0) {
      await queryInterface.bulkInsert('User', usersToInsert, {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('User', {
      username: ['laboran_admin', 'asisten_default']
    }, {});
  }
};
