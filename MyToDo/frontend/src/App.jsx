import { useEffect, useState } from "react";
import { MdOutlineDone } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { MdModeEditOutline } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { IoClipboardOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import axios from "axios";

function App() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState("");

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      const response = await axios.post("/api/tasks", { text: newTodo });
      setTodos([...todos, response.data]);
      setNewTodo("");
    } catch (error) {
      console.log("Error adding todo:", error);
    }
  };

  const fetchTodos = async () => {
    try {
      const response = await axios.get("/api/tasks");
      if (Array.isArray(response.data)) {
        setTodos(response.data);
      } else {
        console.error("Expected an array but got:", response.data);
      }
    } catch (error) {
      console.log("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const startEditing = (todo) => {
    setEditingTodo(todo._id);
    setEditedText(todo.text);
  };

  const saveEdit = async (id) => {
    try {
      const response = await axios.patch(`/api/tasks/${id}`, {
        text: editedText,
      });
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
      setEditingTodo(null);
    } catch (error) {
      console.log("Error updating todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.log("Error deleting todo:", error);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find((t) => t._id === id);
      const response = await axios.patch(`/api/tasks/${id}`, {
        completed: !todo.completed,
      });
      setTodos(todos.map((t) => (t._id === id ? response.data : t)));
    } catch (error) {
      console.log("Error toggling todo:", error);
    }
  };

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 relative overflow-hidden">
      {/* Decorative SVG background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <defs>
          <pattern
            id="dots"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="1"
              cy="1"
              r="1"
              className="text-blue-200"
              fill="currentColor"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <IoClipboardOutline className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Task Manager
            </span>
          </h1>
          <p className="text-gray-600 mb-4">
            {completedCount} of {totalCount} tasks completed
          </p>
          {totalCount > 0 && (
            <div className="w-64 bg-gray-200 rounded-full h-3 mx-auto">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              ></div>
            </div>
          )}
        </div>

        {/* Add Task Form */}
        <div className="bg-white/80 rounded-2xl p-6 shadow-2xl mb-6 border border-gray-100 backdrop-blur-lg">
          <form onSubmit={addTodo}>
            <div className="relative">
              <input
                className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="What would you like to accomplish?"
                required
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FaPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </button>
            </div>
          </form>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {todos.length === 0 ? (
            <div className="bg-white/80 rounded-2xl p-12 text-center shadow-lg border border-gray-100 backdrop-blur-lg">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <IoClipboardOutline className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium">No tasks yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Add a task above to get started!
              </p>
            </div>
          ) : (
            todos.map((todo) => (
              <div key={todo._id} className="group animate-fadein">
                {editingTodo === todo._id ? (
                  // Edit Mode
                  <div className="bg-white/90 rounded-xl p-4 shadow-lg border border-gray-100 transition-all duration-300 backdrop-blur-lg">
                    <div className="flex items-center gap-3">
                      <input
                        className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        type="text"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        autoFocus
                      />
                      <button
                        onClick={() => saveEdit(todo._id)}
                        className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <MdOutlineDone className="w-4 h-4" />
                      </button>
                      <button
                        className="p-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        onClick={() => setEditingTodo(null)}
                      >
                        <IoClose className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <div className="bg-white/90 rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 backdrop-blur-lg">
                    <div className="flex items-center gap-4">
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleTodo(todo._id)}
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 transform hover:scale-110 ${
                          todo.completed
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 border-blue-500 shadow-lg"
                            : "border-gray-300 hover:border-blue-400 hover:shadow-md"
                        }`}
                      >
                        {todo.completed && (
                          <MdOutlineDone className="w-3 h-3 text-white" />
                        )}
                      </button>

                      {/* Task Text */}
                      <span
                        className={`flex-1 font-medium transition-all duration-200 ${
                          todo.completed
                            ? "text-gray-500 line-through"
                            : "text-gray-800"
                        }`}
                      >
                        {todo.text}
                      </span>

                      {/* Action Buttons */}
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          className="p-2 text-blue-500 hover:text-white hover:bg-blue-500 rounded-lg transition-all duration-200 transform hover:scale-110"
                          onClick={() => startEditing(todo)}
                        >
                          <MdModeEditOutline className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteTodo(todo._id)}
                          className="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-all duration-200 transform hover:scale-110"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer Stats */}
        {todos.length > 0 && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-6 bg-white/80 rounded-2xl px-8 py-4 shadow-lg border border-gray-100 backdrop-blur-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{totalCount}</div>
                <div className="text-sm text-gray-500 font-medium">Total</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {completedCount}
                </div>
                <div className="text-sm text-gray-500 font-medium">Done</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {totalCount - completedCount}
                </div>
                <div className="text-sm text-gray-500 font-medium">Pending</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;