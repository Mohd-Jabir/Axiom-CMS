import jwt from "jsonwebtoken";
import {User } from '../features/users/user.model.js'
export const authenticate = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith("Bearer ")) {
    const error = new Error("Authentication required.");
    error.statusCode = 401;
    return next(error);
  }
  const accessToken = authorization.split(" ")[1];
  let decoded
  try {
     decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET_KEY,
    );
  } catch (error) {
    const err = new Error("Invalid or expired access token.");
    err.statusCode = 401;
    return next(err);
  }
  try {
    const user = await User.findById(decoded.userId);

    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 401;
      return next(error);
    }

    if (!user.canLogin()) {
      const error = new Error(
        "Account is not allowed to access this resource.",
      );
      error.statusCode = 403;
      return next(error);
    }

    req.user = user;
    req.auth = decoded;

   return  next();
  } catch (error) {
    return  next(error);
  }
};
