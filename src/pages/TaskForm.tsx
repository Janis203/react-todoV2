import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Task } from '../types';

function TaskForm() {
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const [task, setTask] = useState<Task>({
    id: '',
    title: '',
    content: '',
    completed: false,
  });
  const [loading, setLoading] = useState(false);

  const isEditMode = params.id && params.id !== '';

  const taskId = isEditMode ? params.id : undefined;

  useEffect(() => {
    if (isEditMode && taskId) {
      setLoading(true);
      axios.get(`http://localhost:3004/posts/${taskId}`)
        .then((response) => {
          console.log('Fetched task data:', response.data); 
          setTask(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Failed to load task:', error);
          toast.error('Failed to load task');
          setLoading(false);
        });
    } else {
      setTask({
        id: '', 
        title: '',
        content: '',
        completed: false,
      });
    }
  }, [isEditMode, taskId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditMode) {
        console.log('Updating task:', task); 
        await axios.put(`http://localhost:3004/posts/${task.id}`, task);
        toast.success('Task updated successfully!');
      } else {
        const { id, ...newTask } = task;
        console.log('Creating new task:', newTask); 
        await axios.post('http://localhost:3004/posts', newTask);
        toast.success('Task added successfully!');
      }

      navigate({ to: '/' });
    } catch (error) {
      console.error('Failed to save task:', error);
      toast.error('Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate({ to: '/' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">{isEditMode ? 'Edit Task' : 'Add New Task'}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="task-title" className="block text-sm font-medium">Title</label>
          <input
            id="task-title"
            type="text"
            name="title"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            className="border border-gray-300 rounded p-2 w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="task-content" className="block text-sm font-medium">Content</label>
          <textarea
            id="task-content"
            name="content"
            value={task.content}
            onChange={(e) => setTask({ ...task, content: e.target.value })}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>
        <div>
          <label htmlFor="task-completed" className="block text-sm font-medium">Completed</label>
          <input
            id="task-completed"
            type="checkbox"
            name="completed"
            checked={task.completed}
            onChange={(e) => setTask({ ...task, completed: e.target.checked })}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded shadow"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Task'}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded shadow ml-4"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default TaskForm;
