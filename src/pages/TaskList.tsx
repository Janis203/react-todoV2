import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

type Task = {
  id: string;
  title: string;
  content?: string;
  completed: boolean;
};

function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3004/posts')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setTasks(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
        setError('Failed to load tasks');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleComplete = (id: string) => {
    const task = tasks.find(task => task.id === id);
    if (task) {
      fetch(`http://localhost:3004/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, completed: !task.completed }),
      })
        .then(() => setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)))
        .catch(error => console.error('Error updating task:', error));
    }
  };

  const handleDelete = (id: string) => {
    fetch(`http://localhost:3004/posts/${id}`, { method: 'DELETE' })
      .then(() => setTasks(tasks.filter(task => task.id !== id)))
      .catch(error => console.error('Error deleting task:', error));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Task List</h1>
        <Link to="/posts/add" className="btn btn-primary px-4 py-2 rounded shadow-lg">Add Task</Link>
      </div>

      {tasks.length < 1 ? (
        <p className="text-gray-500 text-center">No tasks available. Start by adding a new task.</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map(task => (
            <li key={task.id} className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 transition">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleComplete(task.id)}
                  className="mr-4 cursor-pointer"
                />
                <span className={`text-lg ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                  {task.title}
                </span>
              </div>
              <div className="flex space-x-3">
                <Link to={`/posts/${task.id}`} className="btn btn-info px-3 py-1 rounded shadow">View</Link>
                <Link to={`/posts/${task.id}/edit`} className="btn btn-warning px-3 py-1 rounded shadow">Edit</Link>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="btn btn-danger px-3 py-1 rounded shadow"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskList;
