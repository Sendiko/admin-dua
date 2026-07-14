module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
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
    tableName: 'Role',
    timestamps: true
  });

  Role.associate = (models) => {
    Role.hasMany(models.User, { foreignKey: 'id_role', as: 'users' });
  };

  return Role;
};
