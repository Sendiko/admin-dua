module.exports = (sequelize, DataTypes) => {
  const Bap = sequelize.define('Bap', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    tanggal: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    jam_masuk: {
      type: DataTypes.TIME,
      allowNull: false
    },
    jam_keluar: {
      type: DataTypes.TIME,
      allowNull: false
    },
    jumlah_jam: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    deskripsi_pekerjaan: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    paraf: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    type: {
      type: DataTypes.ENUM('kegiatan', 'peminjaman', 'pengembalian'),
      allowNull: false
    },
    id_laboratorium: {
      type: DataTypes.UUID,
      allowNull: true
    },
    id_user: {
      type: DataTypes.UUID,
      allowNull: true
    }
  }, {
    tableName: 'Bap',
    timestamps: true
  });

  Bap.associate = (models) => {
    Bap.belongsTo(models.Laboratorium, { foreignKey: 'id_laboratorium', as: 'laboratorium' });
    Bap.belongsTo(models.User, { foreignKey: 'id_user', as: 'user' });
  };

  return Bap;
};
