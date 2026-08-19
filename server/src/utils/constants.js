export const NAME_REGEX = /^[A-Za-z]+$/;

export const EMAIL_REGEX =
  /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

export const USERNAME_REGEX =
  /^(?=.{3,30}$)[a-z0-9](?:[a-z0-9._]*[a-z0-9])$/;

export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,128}$/;
  