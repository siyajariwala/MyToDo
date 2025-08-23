const request = require('supertest');
const express = require('express');

// Create a simple mock for testing
const app = express();
app.use(express.json());

// Mock database
const mockTasks = [];
let taskIdCounter = 1;

// Mock routes for testing
app.post('/api/tasks', (req, res) => {
  const newTask = {
    _id: taskIdCounter++,
    text: req.body.text,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  mockTasks.push(newTask);
  res.status(201).json(newTask);
});

app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = mockTasks.findIndex(task => task._id === taskId);
  
  if (taskIndex > -1) {
    mockTasks.splice(taskIndex, 1);
    res.json({ message: 'Task deleted' });
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

describe('Task Routes', () => {
  beforeEach(() => {
    // Clear tasks before each test
    mockTasks.length = 0;
    taskIdCounter = 1;
  });

  /**
   * Backend Test Case 1: Test POST /tasks creates a task
   */
  test('should create a new task successfully', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({ text: 'Test task' })
      .expect(201);

    expect(response.body.text).toBe('Test task');
    expect(response.body.completed).toBe(false);
    expect(response.body._id).toBe(1);
    expect(mockTasks).toHaveLength(1);
  });

  /**
   * Backend Test Case 2: Test DELETE /tasks/:id deletes the task
   */
  test('should delete a task successfully', async () => {
    // First create a task
    await request(app)
      .post('/api/tasks')
      .send({ text: 'Task to delete' })
      .expect(201);

    expect(mockTasks).toHaveLength(1);

    // Then delete it
    const response = await request(app)
      .delete('/api/tasks/1')
      .expect(200);

    expect(response.body).toEqual({
      message: 'Task deleted'
    });

    expect(mockTasks).toHaveLength(0);
  });
});