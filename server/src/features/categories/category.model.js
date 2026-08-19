import mongoose, { Schema, model } from "mongoose";
import slugify from "slugify";
const categorySchema = new Schema(
  {
    identity: {
      name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
      },
      slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
      },
      description: {
        type: String,
        trim: true,
        maxlength: 200,
      },
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    appearance: {
      icon: String,
    },

    status: {
      type: String,
      lowercase: true,
      enum: ["active", "inactive"],
      default: "active",
    },
    seo: {
      metaTitle: { type: String, maxlength: 60, trim: true },
      metaDescription: { type: String, maxlength: 200, trim: true },
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
categorySchema.index({ status: 1, "identity.name": 1 });
categorySchema.index({ parent: 1, status: 1 });

//statid methods
categorySchema.statics.findBySlug = function (slug) {
  return this.findOne({ "identity.slug": slug });
};

//query helper
categorySchema.query.active = function () {
  return this.where({ status: "active" });
};

categorySchema.query.search = function (search) {
  return this.where({
    "identity.name": {
      $regex: search,
      $options: "i",
    },
  });
};

categorySchema.query.withStatus = function (status) {
  return this.where({
    status,
  });
};

categorySchema.query.withParent = function (parent) {
  return this.where({
    parent,
  });
};
categorySchema.query.notDeleted = function () {
  return this.where({
    isDeleted: false,
  });
};
categorySchema.query.deleted = function () {
  return this.where({
    isDeleted: true,
  });
};
//middleware ( pre hooks)

categorySchema.pre("save", function () {
  if (!this.isModified("identity.name")) return;
  this.identity.slug = slugify(this.identity.name, {
    lower: true,
    strict: true,
  });
});
export const Category = model("Category", categorySchema);
