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
      enum: ["Task", "Bug", "Feature", "Improvement"], 
      default: "Task" 
    },
    status: 
    { 
      type: String, 
      enum: ["To Do", "In Progress", "Done"], 
      default: "To Do" 
    },
    priority: 
    { 
      type: String, 
      enum: ["Low", "Medium", "High"], 
      default: "Medium" 
    },
    dueDate: 
    { 
      type: Date 
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);