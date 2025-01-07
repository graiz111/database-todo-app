const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));


mongoose
  .connect('mongodb+srv://gracesaji111:Gelly123@cluster1.8oa5v.mongodb.net/tasksDB?retryWrites=true&w=majority')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));


const taskSchema = new mongoose.Schema({
  task: { type: String, required: true },
});

const Task = mongoose.model('Task', taskSchema);

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({ task: tasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post('/tasks', async (req, res) => {
  try {
    const { task } = req.body;
    const newTask = new Task({ task });
    await newTask.save();
    const tasks = await Task.find(); 
    res.status(201).json({ task: tasks });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    const tasks = await Task.find(); 
    res.status(200).json({ task: tasks });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { task } = req.body;
    await Task.findByIdAndUpdate(id, { task }, { new: true });
    const tasks = await Task.find();
    res.status(200).json({ task: tasks });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.listen(PORT, () => {
  console.log('Server running on http://localhost:3000');
});
