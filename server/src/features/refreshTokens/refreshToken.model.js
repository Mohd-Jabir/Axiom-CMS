import mongoose, { Schema, model } from "mongoose";

const refreshTokenSchema = new Schema(
  {
    ownership: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
    security: {
      tokenHash: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      expiresAt: {
        type: Date,
        required: true,
      },
      revokedAt: {
        type: Date,
        default: null,
      },
      lastUsedAt: {
        type: Date,
        default: null,
      },
    },
    client: {
      ipAddress: {
        type: String,
        default: null,
      },
      userAgent: {
        type: String,
        default: null,
      },
      deviceName: {
        type: String,
        default: null,
      },
    },
  },
  { timestamps: true },
);
//indexes
refreshTokenSchema.index(
  { "security.expiresAt": 1 },
  { expireAfterSeconds: 0 },
);
refreshTokenSchema.index({
  "ownership.userId": 1,
  "security.revokedAt": 1,
});
//instance methods
refreshTokenSchema.methods.revoke = async function () {
  this.security.lastUsedAt = new Date();

  if (!this.security.revokedAt) {
    this.security.revokedAt = new Date();
  }
  return this.save();
};
refreshTokenSchema.methods.isExpired = function () {
  return this.security.expiresAt <= new Date();
};
refreshTokenSchema.methods.isRevoked = function () {
  return this.security.revokedAt !== null;
};
refreshTokenSchema.methods.isValid = function () {
  return !this.isExpired() && !this.isRevoked();
};

//static methods
refreshTokenSchema.statics.findValidToken = async function (tokenHash) {
  return await this.findOne({
    "security.tokenHash": tokenHash,
    "security.revokedAt": null,
    "security.expiresAt": { $gt: new Date() },
  });
};
refreshTokenSchema.statics.revokeAll = async function (userId) {
  return this.updateMany(
    {
      "ownership.userId": userId,
      "security.revokedAt": null,
    },
    {
      $set: {
        "security.revokedAt": new Date(),
      },
    },
  );
};
export const RefreshToken = model("RefreshToken", refreshTokenSchema);
