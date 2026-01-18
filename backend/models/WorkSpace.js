import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema(
  {
    id: { 
      type: String, 
      required: true, 
      unique: true 
    }, 
    name: 
    { 
      type: String, 
      required: true,
      unique: true
    },
    slug: 
    { 
      type: String, 
      required: true, 
      unique: true 
    },
    ownerId: 
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    role: {
      type: String,
      default: "Admin"
    },
  },
  { timestamps: true }
);

export default mongoose.model("WorkSpace", workspaceSchema);