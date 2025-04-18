const express = require('express');
const multer = require('multer');
const { storage } = require('./utils/cloudinary'); // NEW
const upload = multer({ storage });
const fs = require("fs");
const path = require('path');
const app = express();
const PORT = 3000;

require('dotenv').config();

const mongoose = require('mongoose');
const User = require('./models/User');
const Todo = require('./models/Todo');


mongoose.connect(process.env.MONGODB_URI, {})
.then(() => console.log('MongoDB connected ✅'))
.catch(err => console.error('MongoDB connection error ❌:', err));


// Middleware to parse JSON and form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));


app.get('/', (req, res) => {
  res.redirect('/index.html');
});

app.post('/register', upload.single('image'), async (req, res) => {
    const { username, password } = req.body;
    const image = req.file ? req.file.path : null;
    
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          return res.status(400).json({ message: 'Username already exists' });
        }
    
        const newUser = new User({ username, password, image });
        await newUser.save();
        res.json({ message: 'User registered successfully!' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
      }
  });

  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username, password });
      if (!user) return res.status(401).json({ message: 'Invalid username or password' });
  
      res.json({ 
        message: `Welcome back, ${username}!`,
        userId: user._id,
        imgpath: user.image,
        username: user.username
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.get('/api/todos/:userId', async(req, res) => {
    try{
      const todos = await Todo.find({userId: req.params.userId});
      res.json(todos);
    }
    catch (err) {
      console.error(err);
      res.status(500).json({message: 'Error Fetching Todos'});
    }
  });

  app.post('/api/todos', async (req, res) => {
    const {userId, text} = req.body;
    try{
      const newTodo = new Todo({userId, text});
      await newTodo.save();
      res.status(201).json(newTodo);
    }
    catch(err) {
      console.log(err);
      res.status(500).json({message: 'Error adding Todo'});
    }
  });

  app.patch('/api/todo/:id/toggle', async (req, res) => {
    try{
      const todo = await Todo.findById(req.params.id);
      todo.completed = !todo.completed;
      await todo.save();
      res.json(todo);
    }
    catch(err){
      console.log(err);
      res.status(500).json({message: 'Error Updating todo'});
    }
  });

  app.delete('/api/todo/:id', async (req, res) => {
    try{
      await Todo.findByIdAndDelete(req.params.id);
      res.json({message: 'Todo Deleted'});
    }
    catch(err){
      console.log(err);
      res.status(500).json({message: 'Error while deleting'});
    }
  });
  

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
