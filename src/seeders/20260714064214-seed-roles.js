'use strict';
const crypto = require('crypto');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if roles already exist to prevent duplicate key errors
    const roles = await queryInterface.sequelize.query(
      `SELECT nama FROM Role`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    const existingNames = roles.map(r => r.nama);
    const rolesToInsert = [];

    if (!existingNames.includes('Laboran')) {
      rolesToInsert.push({
        id: crypto.randomUUID(),
        nama: 'Laboran',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    if (!existingNames.includes('Asisten')) {
      rolesToInsert.push({
        id: crypto.randomUUID(),
        nama: 'Asisten',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    if (rolesToInsert.length > 0) {
      await queryInterface.bulkInsert('Role', rolesToInsert, {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Role', {
      nama: ['Laboran', 'Asisten']
    }, {});
  }
};
