import { User } from "./user.model.js";
import { RefreshToken } from "../refreshTokens/refreshToken.model.js";
export const getUserProfile = async (username) => {
  const user = await User.findByUsername(username).active().verified();
  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }
  return {
    username: user.identity.username,
    firstName: user.identity.firstName,
    lastName: user.identity.lastName,
    bio: user.profile.bio,
    avatar: user.profile.avatar,
    createdAt: user.createdAt,
    profileUrl: user.profileUrl,
  };
};
export const updateProfile = async (userId, updates) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }
  if (updates.firstName !== undefined) {
    user.identity.firstName = updates.firstName;
  }

  if (updates.lastName !== undefined) {
    user.identity.lastName = updates.lastName;
  }

  if (updates.bio !== undefined) {
    user.profile.bio = updates.bio;
  }

  if (updates.avatar !== undefined) {
    user.profile.avatar = updates.avatar;
  }
  await user.save();
  return {
    username: user.identity.username,
    fullname: user.fullname,
    bio: user.profile.bio,
    avatar: user.profile.avatar,
    createdAt: user.createdAt,
    profileUrl: user.profileUrl,
  };
};
// export const changeUsername=(userId,username)=>{}
// export const changeEmail=(userId,email)=>{}
export const deleteAccount = async (userId, password) => {
  const user = await User.findOne({
    _id: userId,
    "account.status": "active",
  });
  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    const error = new Error("Incorrect password.");
    error.statusCode = 401;
    throw error;
  }
  user.account.status = "deactivated";
  user.account.deletedAt = new Date();
  await RefreshToken.revokeAll(user._id);
  await user.save();
};
export const getUsers = async ({
  page,
  limit,
  search,
  role,
  status,
  verified,
  sort,
}) => {
  const skip = (page - 1) * limit;
  let query = User.find().select(
    "identity.firstName identity.lastName identity.username identity.email profile.avatar profile.bio authorization.role verification.emailVerified account.status account.deletedAt lastLoginAt createdAt updatedAt",
  );
  if (search) {
    query = query.searchByUsername(search);
  }
  if (status) {
    query = query.withStatus(status);
  }
  if (verified !== undefined) {
    query = query.withVerification(verified === "true");
  }
  if (role) {
    query = query.withRole(role);
  }
  const countQuery = query.clone();
  //sorting and pagination
  query = query
    .sort(sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const users = await query;

  const total = await countQuery.countDocuments().exec();
  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
export const getUserById = async (id) => {
  const user = await User.findById(id)
    .select(
      "identity.firstName identity.lastName identity.username identity.email profile.avatar profile.bio authorization.role verification.emailVerified account.status account.deletedAt lastLoginAt createdAt updatedAt",
    )
    .exec();
  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }
  return user;
};
export const changeRole = async (userId, role, currentAdminId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }
  if (user.id === currentAdminId) {
    const error = new Error("You cannot change your own role.");
    error.statusCode = 403;
    throw error;
  }
  if (user.authorization.role === role) {
    const error = new Error("User already has this role.");
    error.statusCode = 409;
    throw error;
  }
  user.authorization.role = role;
  await user.save();
  return {
    id: user.id,
    username: user.identity.username,
    role: user.authorization.role,
  };
};
// export const suspendUser=(id)=>{}
