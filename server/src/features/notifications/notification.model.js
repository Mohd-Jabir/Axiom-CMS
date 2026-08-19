import mongoose, { Schema, model } from "mongoose";

const notificationSchema = new Schema(
  {
    actor: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
    recipient: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
    target: {
      postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
      commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    },
    event: {
      type: String,
      enum: ["LIKE_POST", "COMMENT_POST", "REPLY_COMMENT", "FOLLOW_USER"],
      required: true,
    },
    status: {
      readAt: {
        type: Date,
        default: null,
      },
    },
  },
  { timestamps: true },
);
//indexes
notificationSchema.index({
  "recipient.userId": 1,
  createdAt: -1,
});
notificationSchema.index({
  "status.readAt": 1,
});
//instance method
notificationSchema.methods.markAsRead = async function () {
  if (!this.status.readAt) {
    this.status.readAt = new Date();
  }
  return this.save();
};
//static methods
notificationSchema.statics.findUnreadByUser = async function (userId) {
  return await this.find({ "recipient.userId": userId, "status.readAt": null });
};
//query helper
notificationSchema.query.unread = function () {
  return this.where({ "status.readAt": null });
};
notificationSchema.query.read = function () {
  return this.where({ "status.readAt": { $ne: null } });
};
export const Notification = model("Notification", notificationSchema);
