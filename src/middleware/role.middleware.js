const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. No role assigned.'
      });
    }

    const hasRole = allowedRoles.some(role => 
      req.user.role.nama.toLowerCase() === role.toLowerCase()
    );

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. This action requires one of the following roles: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
};

module.exports = {
  authorize
};
