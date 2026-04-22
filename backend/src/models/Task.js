import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    id:
    {
      type: String,
      required: true,
      unique: true
    },
    projectId: 
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Project", 
      required: true 
    },
    assignerId: 
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    },
    assigneeId: 
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    },
    title: 
    { 
      type: String, 
      required: true 
    },
    description: 
    { 
      type: String 
    },
    type: 
    { 
      type: String, 
      enum: ["TASK", "BUG", "FEATURE", "IMPROVEMENT", "OTHER"], 
      default: "TASK" 
    },
    status: 
    { 
      type: String, 
      enum: ["TODO", "IN_PROGRESS", "DONE"], 
      default: "TODO" 
    },
    priority: 
    { 
      type: String, 
      enum: ["LOW", "MEDIUM", "HIGH"], 
      default: "MEDIUM" 
    },
    dueDate: 
    { 
      type: Date 
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
