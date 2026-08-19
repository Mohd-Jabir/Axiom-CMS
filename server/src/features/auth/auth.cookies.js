export const refreshCookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: "/",
};
export function setRefreshTokenCookie(res, refreshToken) {
  res.cookie("refreshToken", refreshToken, refreshCookieOptions);
}
export function clearRefreshTokenCookie(res) {
  res.clearCookie("refreshToken", refreshCookieOptions);
}
