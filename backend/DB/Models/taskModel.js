// Import Mongoose
const mongoose = require("mongoose");

// Define the schema for a task
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["todo", "inprogress", "completed"],
      required: true,
    },
    sequence: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Pre-save middleware to set the sequence if not provided
taskSchema.pre("validate", async function (next) {
  console.log("hello");
  try {
    console.log("Pre-save middleware triggered...");

    if (!this.sequence) {
      console.log("Sequence field not provided, calculating...");
      const lastTask = await this.constructor.findOne(
        {},
        {},
        { sort: { sequence: -1 } }
      );

      this.sequence = lastTask ? lastTask.sequence + 1 : 1;
    }

    next(); // Continue with the save operation
  } catch (err) {
    console.error("Error in pre-save middleware:", err);
    next(err); // Pass any error to the next middleware or function
  }
});

// Create Task model from schema
const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
