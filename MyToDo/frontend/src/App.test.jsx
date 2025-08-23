import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import axios from 'axios';
import App from './App';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

// Mock the config file
jest.mock('./config.js', () => 'http://localhost:5000');

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.get.mockResolvedValue({ data: [] });
  });

  /**
   * Test Case 1: Add a task and check if it appears
   */
  test('should add a new task and display it in the list', async () => {
    const user = userEvent.setup();
    
    const newTask = {
      _id: '1',
      text: 'Learn React Testing',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockedAxios.post.mockResolvedValueOnce({ data: newTask });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('No tasks yet')).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('What would you like to accomplish?');
    const addButton = screen.getByRole('button', { name: /add/i });

    await user.type(input, 'Learn React Testing');
    await user.click(addButton);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:5000/api/tasks',
      { text: 'Learn React Testing' }
    );

    await waitFor(() => {
      expect(screen.getByText('Learn React Testing')).toBeInTheDocument();
    });

    expect(input).toHaveValue('');
    expect(screen.getByText('0 of 1 tasks completed')).toBeInTheDocument();
  });

  /**
   * Test Case 2: Mark a task as complete and check status update
   */
  test('should mark a task as complete and update its status', async () => {
    const user = userEvent.setup();
    
    const initialTasks = [{
      _id: '1',
      text: 'Complete assignment',
      completed: false
    }];

    const completedTask = { ...initialTasks[0], completed: true };

    mockedAxios.get.mockResolvedValueOnce({ data: initialTasks });
    mockedAxios.patch.mockResolvedValueOnce({ data: completedTask });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Complete assignment')).toBeInTheDocument();
    });

    expect(screen.getByText('0 of 1 tasks completed')).toBeInTheDocument();
    
    const taskContainer = screen.getByText('Complete assignment').closest('div');
    const checkboxButton = taskContainer.querySelector('button');
    
    await user.click(checkboxButton);

    expect(mockedAxios.patch).toHaveBeenCalledWith(
      'http://localhost:5000/api/tasks/1',
      { completed: true }
    );

    await waitFor(() => {
      expect(screen.getByText('1 of 1 tasks completed')).toBeInTheDocument();
    });

    const taskText = screen.getByText('Complete assignment');
    expect(taskText).toHaveClass('line-through');
  });
});