module.exports = (sequelize, DataTypes) => {
  const Laboratorium = sequelize.define('Laboratorium', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    kode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'Laboratorium',
    timestamps: true
  });

  Laboratorium.associate = (models) => {
    Laboratorium.hasMany(models.Barang, { foreignKey: 'id_laboratorium', as: 'barang' });
    Laboratorium.hasMany(models.User, { foreignKey: 'id_laboratorium', as: 'users' });
    Laboratorium.hasMany(models.Bap, { foreignKey: 'id_laboratorium', as: 'baps' });
  };

  return Laboratorium;
};
