module.exports = (sequelize, DataTypes) => {
  const Kategori = sequelize.define('Kategori', {
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
    tableName: 'Kategori',
    timestamps: true
  });

  Kategori.associate = (models) => {
    Kategori.hasMany(models.Barang, { foreignKey: 'id_kategori', as: 'barang' });
  };

  return Kategori;
};
