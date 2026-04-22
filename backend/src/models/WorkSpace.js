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
      required: true
    },
    slug: 
    { 
      type: String, 
      required: true 
    },
    ownerId: 
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true 
    },
    imageUrl: {
      type: String,
    },
    description: {
      type: String,
      default: null,
    },
    settings: {
      type: Object,
      default: {},
    },
    role: {
      type: String,
      default: "Admin"
    },
  },
  { timestamps: true }
);

workspaceSchema.index({ ownerId: 1, slug: 1 }, { unique: true });

export default mongoose.model("WorkSpace", workspaceSchema);
