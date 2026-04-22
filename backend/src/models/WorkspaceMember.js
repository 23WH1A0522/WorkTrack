import mongoose from "mongoose";

const workspaceMemberSchema = new mongoose.Schema(
  {
    workspaceId: 
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "WorkSpace",
      required: true 
    },
    userId: 
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    role: { 
      type: String, 
      enum: ["ADMIN", "MEMBER"], 
      default: "MEMBER" 
    },
  },
  { timestamps: true }
);

// Prevent duplicate members in the same workspace
workspaceMemberSchema.index(
  { 
    workspaceId: 1, userId: 1 
  }, 
  { 
    unique: true 
  }
);

export default mongoose.model("WorkspaceMember", workspaceMemberSchema);
