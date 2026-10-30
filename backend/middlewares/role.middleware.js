export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'You must be signed in to perform this action'
      });
    }

    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        message: `This action requires ${allowedRoles.join(' or ')} role`,
        yourRole: userRole,
        requiredRoles: allowedRoles
      });
    }

    next();
  };
};
