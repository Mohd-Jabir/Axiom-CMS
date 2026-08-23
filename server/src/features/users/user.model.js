import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
const userSchema = new Schema(
  {
    identity: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      },
    },
    credentials: {
      passwordHash: {
        type: String,
        required: true,
      },
    },
    passwordChangedAt: {
      type: Date,
      default: null,
    },
    profile: {
      avatar: String,
      bio: String,
    },
    authorization: {
      role: {
        type: String,
        required: true,
        enum: ["user", "author", "editor", "admin"],
        default: "user",
        lowercase: true,
        trim: true,
      },
    },
    verification: {
      emailVerified: { type: Boolean, default: true },
    },
    account: {
      status: {
        type: String,
        required: true,
        enum: ["active", "suspended", "banned", "deactivated"],
        default: "active",
        lowercase: true,
        trim: true,
      },
      deletedAt: {
        type: Date,
        default: null,
      },
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
//indexes
userSchema.index({ "account.status": 1, "authorization.role": 1 });

//virtuals

userSchema.virtual("fullname").get(function () {
  return `${this.identity.firstName} ${this.identity.lastName}`.trim();
});
userSchema.virtual("profileUrl").get(function () {
  return `/users/${this.identity.username}`;
});

//instance method
userSchema.methods.comparePassword = function (password) {
  const pepper = process.env.PEPPER;
  return bcrypt.compare(password + pepper, this.credentials.passwordHash);
};

userSchema.methods.hasRole = function (role) {
  return this.authorization.role === role;
};

userSchema.methods.canLogin = function () {
  return this.account.status === "active" && this.verification.emailVerified;
};

// static methods
userSchema.statics.findByEmail =  function (email) {
  return  this.findOne({ "identity.email": email });
};

userSchema.statics.findByUsername =  function (username) {
  return  this.findOne({ "identity.username": username });
};

userSchema.statics.isEmailTaken = async function (email) {
  return !!(await this.findOne({ "identity.email": email }));
};
userSchema.statics.isUsernameTaken = async function (username) {
  return !!(await this.findOne({ "identity.username": username }));
};
userSchema.statics.findByUserId = function (id) {
    return this.findById(id);
};

//query helper
userSchema.query.active = function () {
  return this.where({ "account.status": "active" });
};
userSchema.query.verified = function () {
  return this.where({ "verification.emailVerified": true });
};
userSchema.query.withRole = function (role) {
  return this.where({ "authorization.role": role });
};
userSchema.query.withStatus = function (status) {
    return this.where({ "account.status": status });
};
userSchema.query.withVerification = function (verified) {
    return this.where({
        "verification.emailVerified": verified,
    });
};userSchema.query.searchByUsername = function (search) {
    return this.where({
        "identity.username": {
            $regex: search,
            $options: "i",
        },
    });
};

//middleware(pre hooks)

userSchema.pre("save", async function () {
  if (!this.isModified("credentials.passwordHash")) {
    return;
  }
  const pepper = process.env.PEPPER;

  this.credentials.passwordHash = await bcrypt.hash(
    this.credentials.passwordHash + pepper,
    12,
  );
});

userSchema.pre("save", function () {
  if (!this.isModified("credentials.passwordHash")) {
    return;
  }
  if (this.isNew) {
    return;
  }
  this.passwordChangedAt = new Date();
});

export const User = model("User", userSchema);
