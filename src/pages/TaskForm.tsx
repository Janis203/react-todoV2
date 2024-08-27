import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Import Link here

type Task = {
  id?: string;
  title: string;
  content?: string;
  completed: boolean;
};

function TaskForm() {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task>({ title: '', content: '', completed: false });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      fetch(`http://localhost:3004/posts/${id}`)
        .then(response => response.json())
        .then(data => setTask(data));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `http://localhost:3004/posts/${id}` : 'http://localhost:3004/posts';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    })
      .then(() => navigate('/'))
      .catch(error => console.error('Error saving task:', error));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800">{isEditing ? 'Edit Task' : 'Add Task'}</h1>
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={task.title}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-gray-700">Content</label>
          <textarea
            id="content"
            name="content"
            value={task.content || ''}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="btn btn-primary px-4 py-2 rounded shadow-lg">
          {isEditing ? 'Update Task' : 'Add Task'}
        </button>
      </form>
      <Link to="/" className="mt-4 inline-block text-blue-500">Back to Task List</Link>
    </div>
  );
}

export default TaskForm;
