import mongoose, { Schema, model } from "mongoose";

const commentSchema = new Schema(
  {
    ownership: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
      },
    },
    hierarchy: {
      parentCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: null,
      },
    },
    content: {
      body: {
        type: String,
        required: true,
        maxlength: 100,
        trim: true,
      },
    },
    moderation: {
      editedAt: {
        type: Date,
        default: null,
      },
      deletedAt: {
        type: Date,
        default: null,
      },
    },
  },
  { timestamps: true },
);

//indexes
commentSchema.index({ "ownership.userId": 1 });
commentSchema.index({ "ownership.postId": 1 });
commentSchema.index({ "hierarchy.parentCommentId": 1 });
commentSchema.index({ "moderation.deletedAt": 1 });

//instance methods

commentSchema.methods.edit = async function (newBody) {
  this.content.body = newBody.trim();
  this.moderation.editedAt = new Date();

  return this.save();
};
commentSchema.methods.softDelete = async function () {
  this.moderation.deletedAt = new Date();

  return this.save();
};

//static methods

commentSchema.statics.findByPost =  function (postId) {
  return  this.find({ "ownership.postId": postId });
};
//query helper
commentSchema.query.notDeleted = function () {
  return this.where({ "moderation.deletedAt": null });
};
commentSchema.query.topLevel = function () {
  return this.where({ "hierarchy.parentCommentId": null });
};
commentSchema.query.replies = function (parentCommentId) {
  return this.where({ "hierarchy.parentCommentId": parentCommentId });
};

export const Comment = model("Comment", commentSchema);
