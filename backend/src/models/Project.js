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
        ref: "WorkSpace", 
        required: true 
    },
    name: 
    { 
        type: String, 
        required: true
    },
    description: 
    { 
        type: String 
    },
    status: 
    { 
      type: String, 
      enum: ["PLANNING", "ACTIVE", "COMPLETED", "ON_HOLD", "CANCELLED"], 
      default: "PLANNING" 
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
    },
    teamLeadId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
