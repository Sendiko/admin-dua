module.exports = (sequelize, DataTypes) => {
  const Barang = sequelize.define('Barang', {
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
    jumlah: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_laboratorium: {
      type: DataTypes.UUID,
      allowNull: true
    },
    id_lokasi: {
      type: DataTypes.UUID,
      allowNull: true
    },
    id_kategori: {
      type: DataTypes.UUID,
      allowNull: true
    }
  }, {
    tableName: 'Barang',
    timestamps: true
  });

  Barang.associate = (models) => {
    Barang.belongsTo(models.Laboratorium, { foreignKey: 'id_laboratorium', as: 'laboratorium' });
    Barang.belongsTo(models.Lokasi, { foreignKey: 'id_lokasi', as: 'lokasi' });
    Barang.belongsTo(models.Kategori, { foreignKey: 'id_kategori', as: 'kategori' });
  };

  return Barang;
};
