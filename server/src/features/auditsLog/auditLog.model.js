import mongoose, { Schema, model } from "mongoose";

const auditLogSchema = new Schema(
  {
    actor: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
    action: {
      type: String,
      enum: [
        "POST_CREATED",
        "POST_UPDATED",
        "POST_DELETED",
        "COMMENT_CREATED",
        "COMMENT_UPDATED",
        "COMMENT_DELETED",
        "USER_LOGIN",
        "USER_LOGOUT",
        "ROLE_CHANGED",
        "PASSWORD_CHANGED",
        "EMAIL_VERIFIED",
        "CATEGORY_CREATED",
        "TAG_UPDATED",
      ],
      required: true,
    },
    target: {
      resourceType: {
        type: String,
        required: true,
      },
      resourceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      resourceName: {
        type: String,
      },
    },
    request: {
      ipAddress: {
        type: String,
        default: null,
      },
      userAgent: {
        type: String,
        default: null,
      },
      requestId: {
        type: String,
        default: null,
      },
    },
    metadata: {
      changes: {
        type: Schema.Types.Mixed,
      },
    },
  },
  { timestamps: true },
);
//indexes
auditLogSchema.index({"actor.userId":1});
auditLogSchema.index({action:1});
auditLogSchema.index({
    "target.resourceId":1
});
auditLogSchema.index({
    createdAt:-1
});
export const AuditLog = model("AuditLog", auditLogSchema);
