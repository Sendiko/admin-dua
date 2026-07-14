const { User, Role, Laboratorium } = require('../models');

exports.updateProfile = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    const { 
      username, 
      email, 
      password, 
      nama_lengkap, 
      profileUrl, 
      nomor_telepon 
    } = req.body;

    // If updating username, check uniqueness
    if (username && username !== user.username) {
      const exists = await User.findOne({ where: { username } });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: 'Username already in use.'
        });
      }
      user.username = username;
    }

    // If updating email, check uniqueness
    if (email && email !== user.email) {
      const exists = await User.findOne({ where: { email } });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use.'
        });
      }
      user.email = email;
    }

    // Update fields if provided
    if (nama_lengkap) user.nama_lengkap = nama_lengkap;
    if (profileUrl !== undefined) user.profileUrl = profileUrl;
    if (nomor_telepon !== undefined) user.nomor_telepon = nomor_telepon;
    if (password) user.password = password; // pre-save hook handles hashing

    await user.save();

    // Fetch user with updated attributes and associations (excluding password)
    const updatedUser = await User.findByPk(user.id, {
      include: [
        { model: Laboratorium, as: 'laboratorium' },
        { model: Role, as: 'role' }
      ]
    });

    const userJson = updatedUser.toJSON();
    delete userJson.password;

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: {
        user: userJson
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: error.errors.map(err => err.message).join(', ')
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};
