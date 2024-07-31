const express = require("express");
const Taskrouter = express.Router();
const { authenticate } = require("../Middlewares/authMiddleWare");
const { extractIdFromToken } = require("../../AUTH/Jwt");
const Task = require("../../DB/Models/taskModel");

// Add a new task
Taskrouter.post("/addTask", authenticate, async (req, res) => {
  try {
    // Extract token from headers and clean it
    const token = req.headers["authorization"];
    const id = extractIdFromToken(token);
    console.log(token, id);
    const { title, description, status } = req.body;

    if (title && description && status) {
      const task = new Task({
        title,
        description,
        status,
        user: id, // Use the extracted user ID
      });
      await task.save();
      res.status(200).json({ message: "Task saved successfully" });
    } else {
      res.status(400).json({ message: "Invalid Inputs" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Edit an existing task
Taskrouter.put("/editTask", authenticate, async (req, res) => {
  try {
    // Extract token from headers and clean it
    const token = req.headers["authorization"];
    const id = extractIdFromToken(token);
    const { title, description, status, taskId } = req.body;

    console.log(title, description, status, taskId);

    if (title && description && status && taskId) {
      await Task.findByIdAndUpdate(taskId, {
        title,
        description,
        status,
      });
      res.status(200).json({ message: "Task edited successfully" });
    } else {
      res.status(400).json({ message: "Missing fields" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Get tasks by user ID
Taskrouter.get("/tasks", authenticate, async (req, res) => {
  try {
    // Extract token from headers and clean it
    console.log("from taks");
    const token = req.headers["authorization"];
    const id = extractIdFromToken(token);

    const tasks = await Task.find({ user: id }).sort({ updatedAt: -1 });

    let arr = [
      { title: "Todo", values: [] },
      { title: "In Progress", values: [] },
      { title: "Done", values: [] },
    ];

    tasks.forEach((task) => {
      if (task.status === "todo") {
        arr[0].values.push(task);
      } else if (task.status === "inprogress") {
        arr[1].values.push(task);
      } else if (task.status === "completed") {
        arr[2].values.push(task);
      }
    });

    console.log(arr, "arun");

    res.status(200).json({ tasks: arr });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Update the status of a task
Taskrouter.put("/updateTaskStatus", authenticate, async (req, res) => {
  try {
    const { taskId, status } = req.body;
    if (taskId && status) {
      await Task.findByIdAndUpdate(taskId, { status });
      res.status(200).json({ message: "Task updated successfully" });
    } else {
      res.status(400).json({ message: "Missing fields" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Delete a task
Taskrouter.delete("/deleteTask", authenticate, async (req, res) => {
  try {
    const { taskId } = req.body;
    if (taskId) {
      await Task.findByIdAndDelete(taskId);
      res.status(200).json({ message: "Task deleted successfully" });
    } else {
      res.status(400).json({ message: "Task ID is required" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

Taskrouter.get("/searchTasks", authenticate, async (req, res) => {
  const searchQuery = req.query.search || ""; // Default to empty string if not provided
  const sortBy = req.query.sortBy || "";
  const token = req.headers["authorization"];
  const id = extractIdFromToken(token);

  let sortByObj = {};

  if (sortBy == "updatedAt") {
    sortByObj = { updatedAt: -1 };
  } else if (sortBy == "title") {
    sortByObj = { title: 1 };
  } else if (sortBy == "description") {
    sortByObj = { description: 1 };
  } else {
    sortByObj = { sequence: 1 };
  }

  try {
    // Fetch tasks for the authenticated user
    let tasks = await Task.find({ user: id }).sort(sortByObj);

    // Filter tasks based on the search query
    tasks = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Organize tasks by status
    const arr = [
      { title: "Todo", values: [] },
      { title: "In Progress", values: [] },
      { title: "Done", values: [] },
    ];

    tasks.forEach((task) => {
      if (task.status === "todo") {
        arr[0].values.push(task);
      } else if (task.status === "inprogress") {
        arr[1].values.push(task);
      } else if (task.status === "completed") {
        arr[2].values.push(task);
      }
    });

    res.status(200).json({ tasks: arr });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

Taskrouter.get("/taskdetails", authenticate, async (req, res) => {
  const taskId = req.query.taskId || "";

  try {
    const task = await Task.findOne({ _id: taskId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

Taskrouter.put("/tasksSeq", authenticate, async (req, res) => {
  const { source, destination, columns, updatedElementId } = req.body;

  try {
    // Update status of the updated element
    let status =
      destination == 0 ? "todo" : destination == 1 ? "inprogress" : "completed";

    // console.log(source, destination, status);
    await Task.findOneAndUpdate({ _id: updatedElementId }, { status });

    // Update sequence for tasks in the source column
    let seq = 1;
    // console.log(source, destination, seq,columns);
    const sourceTasks = columns[source].values;
    for (let i = 0; i < sourceTasks.length; i++) {
      await Task.findOneAndUpdate(
        { _id: sourceTasks[i]._id },
        { sequence: seq },
        { new: true } // Return updated document
      );
      seq++;
    }

    // Update sequence for tasks in the destination column
    const destinationTasks = columns[destination].values;
    let maxSequence = seq - 1; // Start from the next available sequence number
    for (let i = 0; i < destinationTasks.length; i++) {
      await Task.findOneAndUpdate(
        { _id: destinationTasks[i]._id },
        { sequence: maxSequence + 1 },
        { new: true } // Return updated document
      );
      maxSequence++;
    }

    res.status(200).json({ message: "Tasks successfully sequenced" });
  } catch (err) {
    console.error("Error sequencing tasks:", err);
    res.status(500).json({ message: "Failed to sequence tasks" });
  }
});

module.exports = Taskrouter;
