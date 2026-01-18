import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    id: {
        type: String,
        required: true,
        unique: true
    },
    workspaceId: 
    { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Workspace", 
        required: true 
    },
    name: 
    { 
        type: String, 
        required: true,
        unique: true
    },
    description: 
    { 
        type: String 
    },
    status: 
    { 
      type: String, 
      enum: ["Planning", "Active", "Completed"], 
      default: "Planning" 
    },
    progress: 
    { 
        type: Number, 
        default: 0 
    },
    startDate: 
    { 
        type: Date 
    },
    endDate: 
    { 
        type: Date 
    }
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);