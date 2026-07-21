/*
|--------------------------------------------------------------------------
| Role Authorization Middleware
|--------------------------------------------------------------------------
| Allows access only to users whose role is included in allowedRoles.
|--------------------------------------------------------------------------
*/

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required",
      });
    }

    const normalizedAllowedRoles = allowedRoles.map((role) =>
      String(role).toLowerCase(),
    );

    const userRole = String(req.user.role).toLowerCase();

    if (!normalizedAllowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message:
          "You do not have permission to access this resource",
      });
    }

    return next();
  };
};

export const requireAdmin = authorizeRoles("admin");

export const requireTenant = authorizeRoles("tenant");

export const requireAdminOrTenant = authorizeRoles(
  "admin",
  "tenant",
);

export default authorizeRoles;