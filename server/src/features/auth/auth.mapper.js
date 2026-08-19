export function serializeUser(user) {
  return {
    id: user._id,
    firstName: user.identity.firstName,
    lastName: user.identity.lastName,
    username: user.identity.username,
    email: user.identity.email,
    role: user.authorization.role,
    avatar: user.profile.avatar,
    bio: user.profile.bio,
  };
}
