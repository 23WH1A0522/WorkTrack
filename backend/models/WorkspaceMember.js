import mongoose from "mongoose";

const workspaceMemberSchema = new mongoose.Schema(
  {
    workspaceId: 
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Workspace", 
      required: true 
    },
    Id: 
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    role: { 
      type: String, 
      enum: ["Admin", "Member"], 
      default: "Member" 
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