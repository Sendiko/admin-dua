module.exports = (sequelize, DataTypes) => {
  const Lokasi = sequelize.define('Lokasi', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'Lokasi',
    timestamps: true
  });

  Lokasi.associate = (models) => {
    Lokasi.hasMany(models.Barang, { foreignKey: 'id_lokasi', as: 'barang' });
  };

  return Lokasi;
};
