import { User } from "../users/user.model.js";
import { RefreshToken } from "../refreshTokens/refreshToken.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  getTokenExpiry,
  verifyRefreshToken,
  generateEmailVerificationToken,
  verifyEmailVerificationToken,
} from "./auth.utils.js";
import { transporterMail } from "./auth.mail.js";
import { serializeUser } from "./auth.mapper.js";
export async function register(userData) {
  const {
    firstName,
    lastName,
    username,
    email,
    password,
  } = userData;

  const userNameExists = await User.isUsernameTaken(username);

  if (userNameExists) {
    const error = new Error("Username already exists");
    error.statusCode = 409;
    throw error;
  }

  const userEmailExists = await User.isEmailTaken(email);

  if (userEmailExists) {
    const error = new Error("Email already exists");
    error.statusCode = 409;
    throw error;
  }

  let user;

  try {
    user = await User.create({
      identity: {
        firstName,
        lastName,
        username,
        email,
      },

      credentials: {
        passwordHash: password,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      const err = new Error(
        "Username or email already exists"
      );

      err.statusCode = 409;

      throw err;
    }

    throw error;
  }

  const verificationToken =
    generateEmailVerificationToken(user);

  const verificationURL =
    `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

  try {
    await transporterMail(
      verificationURL,
      user
    );
  } catch (error) {
    console.error(
      "EMAIL SENDING ERROR:",
      error
    );

    return {
      success: true,
      emailSent: false,
      message:
        "Registration successful, but we couldn't send the verification email. Please request another verification email.",
    };
  }

  return {
    success: true,
    emailSent: true,
    message:
      "Registration successful. Please check your email to verify your account.",
  };
}
export async function login(credentials) {
  const { email, password, ipAddress, userAgent } = credentials;

  const user = await User.findByEmail(email);
  if (!user) {
    const error = new Error("Invalid email or password. ");
    error.statusCode = 404;
    throw error;
  }
  const isPasswordCoreect = await user.comparePassword(password);
  if (!isPasswordCoreect) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }
  if (!user.canLogin()) {
    if (!user.verification.emailVerified) {
      const error = new Error("Please verify your email before logging in.");
      error.statusCode = 403;
      throw error;
    }

    if (user.account.status === "suspended") {
      const error = new Error("Your account has been suspended.");
      error.statusCode = 403;
      throw error;
    }

    if (user.account.status === "banned") {
      const error = new Error("Your account has been banned.");
      error.statusCode = 403;
      throw error;
    }

    if (user.account.status === "deactivated") {
      const error = new Error("Your account has been deactivated.");
      error.statusCode = 403;
      throw error;
    }
  }
  user.lastLoginAt = Date.now();
  await user.save();

  // token
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  const tokenHash = hashRefreshToken(refreshToken);
  await RefreshToken.create({
    ownership: {
      userId: user._id,
    },
    security: {
      tokenHash,
      expiresAt: getTokenExpiry(refreshToken),
    },
    client: {
      ipAddress,
      userAgent,
      deviceName: "Unknown",
    },
  });
  return {
    message: "Login successful",
    accessToken,
    refreshToken,
    user: serializeUser(user),
  };
}
export async function refreshAccessToken({
  refreshToken,
  ipAddress,
  userAgent,
}) {
  if (!refreshToken) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (err) {
    const error = new Error("Invalid or expired refresh token.");
    error.statusCode = 401;
    throw error;
  }
  const tokenHash = hashRefreshToken(refreshToken);
  const storedToken = await RefreshToken.findValidToken(tokenHash);

  if (!storedToken) {
    const error = new Error("Refresh token is invalid or revoked.");
    error.statusCode = 401;
    throw error;
  }
  const user = await User.findById(decoded.userId);
  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 401;
    throw error;
  }
  if (!user.canLogin()) {
    const error = new Error("Account is not allowed to log in.");
    error.statusCode = 403;
    throw error;
  }
  const accessToken = generateAccessToken(user);
  await storedToken.revoke();
  const newRefreshToken = generateRefreshToken(user);
  const newTokenHash = hashRefreshToken(newRefreshToken);
  await RefreshToken.create({
    ownership: {
      userId: user._id,
    },
    security: {
      tokenHash: newTokenHash,
      expiresAt: getTokenExpiry(newRefreshToken),
    },
    client: {
      ipAddress,
      userAgent,
      deviceName: "Unknown",
    },
  });
  return {
    message: "Access token refreshed successfully.",
    accessToken,
    refreshToken: newRefreshToken,
    user: serializeUser(user),
  };
}
export async function logout(refreshToken) {
  if (!refreshToken) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }
  try {
    verifyRefreshToken(refreshToken);
  } catch (err) {
    const error = new Error("Invalid or expired refresh token.");
    error.statusCode = 401;
    throw error;
  }
  const tokenHash = hashRefreshToken(refreshToken);
  const storedToken = await RefreshToken.findValidToken(tokenHash);

  if (storedToken) {
    await storedToken.revoke();
  }
  return {
    message: "Logged out successfully",
  };
}
export async function logoutAll(userId) {
  await RefreshToken.revokeAll(userId);
  return {
    message: "Logged out from all devices successfully.",
  };
}
export async function verifyEmail(token) {
  if (!token) {
    const error = new Error("Verification token is required.");
    error.statusCode = 400;
    throw error;
  }
  let decoded;
  try {
    decoded = verifyEmailVerificationToken(token);
  } catch (error) {
    const err = new Error("Invalid or expired verification link.");
    err.statusCode = 401;
    throw err;
  }

  if (decoded.purpose !== "email-verification") {
    const error = new Error(
      "This token cannot be used for email verification.",
    );
    error.statusCode = 400;
    throw error;
  }
  const user = await User.findById(decoded.userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  if (user.verification.emailVerified) {
    return {
      message: "Email is already verified.",
    };
  }
  user.verification.emailVerified = true;

  await user.save();
  return {
    message: "Email verified successfully.",
  };
}
export async function resendVerification(email) {
  const user = await User.findByEmail(email);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;

    throw error;
  }

  if (user.verification.emailVerified) {
    const error = new Error(
      "Email is already verified."
    );

    error.statusCode = 409;

    throw error;
  }

  const verificationToken =
    generateEmailVerificationToken(user);

  const verificationURL =
    `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

  try {
    await transporterMail(
      verificationURL,
      user
    );
  } catch (error) {
    console.error(
      "RESEND EMAIL ERROR:",
      error
    );

    const err = new Error(
      "We couldn't send the verification email. Please try again later."
    );

    err.statusCode = 500;

    throw err;
  }

  return {
    success: true,
    emailSent: true,
    message:
      "Verification email sent successfully.",
  };
}
export async function getCurrentUser(userData) {
  return {
    user: serializeUser(userData),
  };
}
