const express =  require('express');
const mongoose = require('mongoose');
const cors =     require('cors');
const Todo =     require('./models/Todo');

const app = express();

app.use(require('cors')());
app.use(express.json());

mongoose.connect('mongodb+srv://pranay:Pranay12@cluster0.kyrdkbq.mongodb.net/todos?retryWrites=true&w=majority')
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB ERROR:", err));


app.get('/', (req, res) => {
  res.send('working');
});
app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post('/todos', async (req, res) => {
  const newTodo = new Todo(req.body);
  await newTodo.save();
  res.json(newTodo);
});

app.put('/todos/:id', async (req, res) => {
  const updated = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});


app.delete('/todos/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("Server running"));