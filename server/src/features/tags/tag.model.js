import mongoose, { Schema, model } from "mongoose";
import slugify from "slugify";
const tagSchema = new Schema(
  {
    identity: {
      name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
      },
    },
    status: {
      type: String,
      lowercase: true,
      enum: ["active", "inactive"],
      default: "active",
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);
//indexes
tagSchema.index({ status: 1, "identity.name": 1 });
//static methods
tagSchema.statics.findBySlug =  function (slug) {
  return  this.findOne({ "identity.slug": slug });
};
//query helper
tagSchema.query.active = function () {
  return this.where({ status: "active" });
};
tagSchema.query.notDeleted = function () {
  return this.where({ isDeleted: false });
};

tagSchema.query.withStatus = function (status) {
  return this.where({ status });
};

tagSchema.query.search = function (search) {
  return this.where({
    "identity.name": {
      $regex: search,
      $options: "i",
    },
  });
};

//middleware ( pre hooks)
tagSchema.pre("save", function () {
  if (!this.isModified("identity.name")) return;
  this.identity.slug = slugify(this.identity.name, {
    lower: true,
    strict: true,
  });
});
export const Tag = model("Tag", tagSchema);
