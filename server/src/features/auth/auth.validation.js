import {
  NAME_REGEX,
  EMAIL_REGEX,
  USERNAME_REGEX,
  PASSWORD_REGEX,
} from "../../utils/constants.js";

export function registerSchema(req, res, next) {
  const firstName = req.body.firstName?.trim();
  const lastName = req.body.lastName?.trim();
  const username = req.body.username?.trim().toLowerCase();
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password.trim();
  Object.assign(req.body, {
    firstName,
    lastName,
    username,
    email,
    password,
  });
  if (!firstName || !lastName || !username || !email || !password) {
    return res
      .status(422)
      .json({ message: "All required fields must be provided.",firstName,lastName });
  }
  if (firstName.length < 2 || firstName.length > 30) {
    return res.status(422).json({
      message: "First name must be between 2 and 30 characters",
    });
  }
  if (lastName.length < 2 || lastName.length > 30) {
    return res.status(422).json({
      message: "Last name must be between 2 and 30 characters",
    });
  }
  if (!NAME_REGEX.test(firstName)) {
    return res
      .status(422)
      .json({ message: "First name can contain only letters." });
  }
  if (!NAME_REGEX.test(lastName)) {
    return res
      .status(422)
      .json({ message: "Last name can contain only letters." });
  }

  if (!USERNAME_REGEX.test(username)) {
    return res.status(422).json({
      message:
        "Username must be 3–30 characters and contain only lowercase letters, numbers, underscores, or periods.",
    });
  }
  if (!EMAIL_REGEX.test(email)) {
    return res.status(422).json({ message: "Enter valid email address" });
  }

  if (!PASSWORD_REGEX.test(password)) {
    return res.status(422).json({ message: "Enter strong password" });
  }
  next();
}
export function loginSchema(req, res, next) {
  //email password captcha
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password?.trim();
  Object.assign(req.body, {
    email,
    password,
  });
  if (!email || !password) {
    return res
      .status(422)
      .json({ message: "Email and password are required" });
  }
  if (!EMAIL_REGEX.test(email)) {
    return res.status(422).json({ message: "Enter valid email address" });
  }
  return next();
}
export function forgotSchema(req, res, next) {
  //email
  const email = req.body.email?.trim().toLowerCase();
    Object.assign(req.body, {
    email,
  });
  if (!email) {
    return res
      .status(422)
      .json({ message: "Email are required" });
  }
  if (!EMAIL_REGEX.test(email)) {
    return res.status(422).json({ message: "Enter valid email address" });
  }
  return next();
}
export function resetSchema(req, res, next) {
  //password confirm password reset token
}

export function resedSchema( req,res,next){
    const email = req.body.email?.trim().toLowerCase();
    Object.assign(req.body, {
    email,
  });
  if (!email) {
    return res
      .status(422)
      .json({ message: "Email are required" });
  }
  if (!EMAIL_REGEX.test(email)) {
    return res.status(422).json({ message: "Enter valid email address" });
  }
  return next();
}
