module.exports = (sequelize, DataTypes) => {
  const BarangHilang = sequelize.define('BarangHilang', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lokasi_penemuan: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ditemukan_oleh: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tanggal_ditemukan: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    lokasi_penyimpanan: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'BarangHilang',
    timestamps: true
  });

  return BarangHilang;
};
