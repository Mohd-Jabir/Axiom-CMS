export function ownership(Model, paramName, ownerField) {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[paramName];

      const resource = await Model.findById(resourceId);

      if (!resource) {
        const error = new Error("Resource not found.");
        error.statusCode = 404;
        return next(error);
      }
      if (req.user.authorization.role === "admin") {
        req.resource = resource;
        return next();
      }

      let owner = resource;

      for (const key of ownerField.split(".")) {
        owner = owner?.[key];
      }

      if (!owner || !owner.equals(req.user._id)) {
        const error = new Error(
          "You do not have permission to access this resource.",
        );
        error.statusCode = 403;
        return next(error);
      }

      req.resource = resource;

      next();
    } catch (error) {
      next(error);
    }
  };
}
