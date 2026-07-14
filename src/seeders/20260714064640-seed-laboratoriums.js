'use strict';
const crypto = require('crypto');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Generate codes programmatically
    const codes = [];
    for (let i = 1; i <= 5; i++) codes.push(`A${i}`);
    for (let i = 1; i <= 5; i++) codes.push(`B${i}`);
    for (let i = 1; i <= 3; i++) codes.push(`C${i}`);
    for (let i = 1; i <= 5; i++) codes.push(`D${i}`);

    // Query existing laboratoriums to avoid duplicate inserts
    const existing = await queryInterface.sequelize.query(
      `SELECT kode FROM Laboratorium`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const existingCodes = existing.map(r => r.kode);

    const dataToInsert = [];
    for (const code of codes) {
      if (!existingCodes.includes(code)) {
        dataToInsert.push({
          id: crypto.randomUUID(),
          kode: code,
          nama: `Laboratorium ${code}`,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    if (dataToInsert.length > 0) {
      await queryInterface.bulkInsert('Laboratorium', dataToInsert, {});
    }
  },

  async down(queryInterface, Sequelize) {
    const codes = [];
    for (let i = 1; i <= 5; i++) codes.push(`A${i}`);
    for (let i = 1; i <= 5; i++) codes.push(`B${i}`);
    for (let i = 1; i <= 3; i++) codes.push(`C${i}`);
    for (let i = 1; i <= 5; i++) codes.push(`D${i}`);

    await queryInterface.bulkDelete('Laboratorium', {
      kode: codes
    }, {});
  }
};
