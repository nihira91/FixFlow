exports.allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. Login required." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden. You do not have permission to access this route."
      });
    }

    next();
  };
};
