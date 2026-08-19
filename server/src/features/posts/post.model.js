import mongoose, { Schema, model } from "mongoose";
import slugify from "slugify";
const postSchema = new Schema(
  {
    identity: {
      title: {
        type: String,
        required:true,
        trim: true,
        maxlength: 60,
      },
      slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
      },
      slugHistory: [
        {
          type: String,
          lowercase: true,
          trim: true,
        },
      ],
      excerpt: {
        type: String,
        maxlength: 300,
      },
    },
    content: {
      body: { type: String, required: true, trim: true },
      format: {
        type: String,
        enum: ["markdown", "html", "plaintext", "json"],
        default: "markdown",
      },
      coverImage: String,
    },
    author: {
      authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
    publishing: {
      status: {
        type: String,
        enum: ["draft", "published", "archived"],
        default: "draft",
        lowercase: true,
      },
      publishedAt: {
        type: Date,
        default: null,
      },
      visibility: {
        type: String,
        enum: ["public", "private", "unlisted"],
        default: "public",
      },
    },
    engagement: {
      views: { type: Number, default: 0, min: 0 },
      likesCount: { type: Number, default: 0, min: 0 },
      commentsCount: { type: Number, default: 0, min: 0 },
      // bookmarkCount: { type: Number, default: 0, min: 0 },
    },
    classification: {
      categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
      tagIds: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Tag",
        },
      ],
    },

    seo: {
      metaTitle: { type: String, maxlength: 60, trim: true },
      metaDescription: { type: String, maxlength: 200, trim: true },
    },
    deletedAt: {
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
postSchema.index({ "author.authorId": 1 });
postSchema.index({ "classification.categoryId": 1 });
postSchema.index({ "classification.tagIds": 1 });
postSchema.index({ "publishing.status": 1 });
postSchema.index({ "publishing.publishedAt": -1 });
postSchema.index({ deletedAt: 1 });

//virtuals
postSchema.virtual("url").get(function () {
  return `/posts/${this.identity.slug}`;
});
postSchema.virtual("isPublished").get(function () {
  return this.publishing.status === "published";
});
postSchema.virtual("isDeleted").get(function () {
  return this.deletedAt !== null;
});

//instance methods
postSchema.methods.publish = async function () {
  this.publishing.status = "published";

  if (!this.publishing.publishedAt) {
    this.publishing.publishedAt = new Date();
  }
  return this.save();
};
postSchema.methods.archive = async function () {
  this.publishing.status = "archived";

  return this.save();
};

//static methods

postSchema.statics.findPublished = function () {
  return this.find({ "publishing.status": "published" });
};
postSchema.statics.findBySlug = function (slug) {
  return this.findOne({ "identity.slug": slug });
};
postSchema.statics.findByAuthor = function (authorId) {
  return this.find({ "author.authorId": authorId });
};

//query helper
postSchema.query.published = function () {
  return this.where({ "publishing.status": "published" });
};
postSchema.query.publicOnly = function () {
  return this.where({ "publishing.visibility": "public" });
};
postSchema.query.notDeleted = function () {
  return this.where({
    deletedAt: null,
  });
};
postSchema.query.byCategory = function (id) {
  return this.where({ "classification.categoryId": id });
};
postSchema.query.byTag = function (id) {
  return this.where({ "classification.tagIds": id });
};
postSchema.query.byAuthor = function (id) {
  return this.where({ "author.authorId": id });
};
postSchema.query.newest = function () {
  return this.sort({
    "publishing.publishedAt": -1,
  });
};
postSchema.query.oldest = function () {
  return this.sort({
    "publishing.publishedAt": 1,
  });
};
postSchema.query.withVisibility = function (visibility) {
  return this.where({
    "publishing.visibility": visibility,
  });
};
postSchema.query.withStatus = function (status) {
  return this.where({
    "publishing.status": status,
  });
};
postSchema.query.search = function (search) {
  if (!search?.trim()) {
    return this;
  }

  const escapedSearch = search
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const regex = new RegExp(escapedSearch, "i");

  return this.where({
    $or: [
      { "identity.title": regex },
      { "identity.excerpt": regex },
      { "content.body": regex },
    ],
  });
};
//middleware(pre hooks)

postSchema.pre("save", function () {
  if (!this.isModified("identity.title")) return;
  const newSlug = slugify(this.identity.title, {
    lower: true,
    strict: true,
  });
  if (this.identity.slug && this.identity.slug !== newSlug) {
    this.identity.slugHistory.push(this.identity.slug);
  }
  this.identity.slug = newSlug;
});
postSchema.pre("save", function () {
  if (this.publishing.status === "published" && !this.publishing.publishedAt) {
    this.publishing.publishedAt = new Date();
  }
});
export const Post = model("Post", postSchema);
