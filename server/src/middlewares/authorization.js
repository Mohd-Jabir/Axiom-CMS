export const authorize = (...roles) => {
  return (req, res, next) => {
    const userRole=req.user.authorization.role;
    if(!roles.includes(userRole)){
          const error = new Error("You do not have permission to perform this action.");
      error.statusCode = 403;
      return next(error);
    }
    next();
  };

};
