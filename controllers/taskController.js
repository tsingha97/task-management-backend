const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  // pull out assignedTo so we can sanitize empty string → null
  const { assignedTo, ...rest } = req.body;
  const taskData = {
    ...rest,
    createdBy: req.user.id,
    // only set assignedTo if it’s a non-empty value
    assignedTo: assignedTo ? assignedTo : null,
  };
  const task = await Task.create(taskData);
  res.status(201).json(task);
};

exports.getTasks = async (req, res) => {
  const { status, priority, search } = req.query;
  let query = {
    $or: [{ createdBy: req.user.id }, { assignedTo: req.user.id }],
  };

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (search) query.title = { $regex: search, $options: "i" };

  const tasks = await Task.find(query).populate("assignedTo", "name");
  res.json(tasks);
};

exports.updateTask = async (req, res) => {
  // sanitize assignedTo on update
  const { assignedTo, ...rest } = req.body;
  const updateData = {
    ...rest,
    assignedTo: assignedTo === "" ? null : assignedTo,
  };
  const task = await Task.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
  });
  res.json(task);
};

exports.deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
};
