const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Username already in use.'
      },
      validate: {
        notEmpty: { msg: 'Username is required.' },
        len: {
          args: [3, 30],
          msg: 'Username must be between 3 and 30 characters.'
        }
      }
    },
    nama_lengkap: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Nama lengkap is required.' }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Password is required.' },
        len: {
          args: [6, 100],
          msg: 'Password must be at least 6 characters long.'
        }
      }
    },
    profileUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    id_laboratorium: {
      type: DataTypes.UUID,
      allowNull: true
    },
    id_role: {
      type: DataTypes.UUID,
      allowNull: true
    },
    nomor_telepon: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'User',
    timestamps: true,
    hooks: {
      beforeSave: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    },
    defaultScope: {
      attributes: { exclude: ['password'] }
    },
    scopes: {
      withPassword: {
        attributes: {},
      }
    }
  });

  // Instance method to compare password
  User.prototype.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };

  User.associate = (models) => {
    User.belongsTo(models.Laboratorium, { foreignKey: 'id_laboratorium', as: 'laboratorium' });
    User.belongsTo(models.Role, { foreignKey: 'id_role', as: 'role' });
    User.hasMany(models.Bap, { foreignKey: 'id_user', as: 'baps' });
  };

  return User;
};
