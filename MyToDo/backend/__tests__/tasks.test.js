// __tests__/tasks.test.js
const request = require('supertest');
const express = require('express');

// Create a simple test app
const app = express();
app.use(express.json());

// Mock data storage
let tasks = [];
let idCounter = 1;

// Simple routes for testing
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  if (!req.body.text) {
    return res.status(400).json({ message: 'Task text is required' });
  }
  
  const newTask = {
    id: idCounter++,
    text: req.body.text,
    completed: false
  };
  
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }
  
  tasks.splice(taskIndex, 1);
  res.json({ message: 'Task deleted successfully' });
});

describe('Backend API Tests', () => {
  beforeEach(() => {
    // Reset data before each test
    tasks = [];
    idCounter = 1;
  });

  // Test Case 1: Create a task
  test('POST /api/tasks should create a new task', async () => {
    const taskData = {
      text: 'Learn Node.js testing'
    };

    const response = await request(app)
      .post('/api/tasks')
      .send(taskData)
      .expect(201);

    expect(response.body).toEqual({
      id: 1,
      text: 'Learn Node.js testing',
      completed: false
    });
    
    // Verify task was added to our mock storage
    expect(tasks).toHaveLength(1);
    expect(tasks[0].text).toBe('Learn Node.js testing');
  });

  // Test Case 2: Delete a task
  test('DELETE /api/tasks/:id should delete a task', async () => {
    // First, add a task to delete
    const taskToDelete = {
      id: 1,
      text: 'Task to be deleted',
      completed: false
    };
    tasks.push(taskToDelete);

    const response = await request(app)
      .delete('/api/tasks/1')
      .expect(200);

    expect(response.body).toEqual({
      message: 'Task deleted successfully'
    });
    
    // Verify task was removed from our mock storage
    expect(tasks).toHaveLength(0);
  });
});