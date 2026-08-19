import * as authService from "./auth.service.js";
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from "./auth.cookies.js";
export async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const result = await authService.login({
      ...req.body,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });
    setRefreshTokenCookie(res, result.refreshToken);

    res.status(200).json({
      message: result.message,
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
}
export async function logout(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;
    const result = await authService.logout(refreshToken);
    clearRefreshTokenCookie(res);
    res.status(200).json({ message: result.message });
  } catch (error) {
    next(error);
  }
}
export async function logoutAll(req, res, next) {
  try {
    const result = await authService.logoutAll(req.user._id);
    res.status(200).json({
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
}
export async function refreshAccessToken(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;
    const result = await authService.refreshAccessToken({
      refreshToken,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });
    setRefreshTokenCookie(res, result.refreshToken);
    res.status(200).json({
      message: result.message,
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
}
// export async function forgotPassword(req, res) {}
// export async function resetPassword(req, res) {}
// export async function changePassword(req, res) {}
export async function verifyEmail(req, res, next) {
  try {
    const token = req.query.token;
    const result = await authService.verifyEmail(token);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
export async function resendVerification(req, res,next) {
try{
  const result=await authService.resendVerification(req.body.email);
   res.status(200).json(result);
}
catch(error){
next(error);
}
}
export async function getCurrentUser(req, res,next) {
    try{
      const result=await authService.getCurrentUser(req.user);
      res.status(200).json(result);
    }
    catch(error){
      next(error);
    }
}
