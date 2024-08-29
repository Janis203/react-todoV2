import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import axios from 'axios';

type Task = {
  id: string;
  title: string;
  content?: string;
  completed: boolean;
};

function TaskList() {
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading, error } = useQuery<Task[], Error>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:3004/posts');
      return response.data;
    }
  });

  const completeMutation = useMutation({
    mutationFn: async (task: Task) => {
      await axios.put(`http://localhost:3004/posts/${task.id}`, {
        ...task,
        completed: !task.completed
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (taskId: string) => {
      await axios.delete(`http://localhost:3004/posts/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleComplete = (task: Task) => {
    completeMutation.mutate(task);
  };

  const handleDelete = (taskId: string) => {
    deleteMutation.mutate(taskId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Task List</h1>
        <Link
          to="/posts/add" 
          className="btn btn-primary px-4 py-2 rounded shadow-lg"
        >
          Add Task
        </Link>
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
                  id={`task-completed-${task.id}`}
                  checked={task.completed}
                  onChange={() => handleComplete(task)}
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
