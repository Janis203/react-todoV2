import { useState, useEffect } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Task, Comment } from '../types';
import { Spinner } from '../components/Spinner';

function TaskDetail() {
  const { id } = useParams({ from: '/posts/$id' });
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskAndComments = async () => {
      try {
        console.log('Fetching task with ID:', id); 
        const [taskResponse, commentsResponse] = await Promise.all([
          axios.get(`http://localhost:3004/posts/${id}`),
          axios.get(`http://localhost:3004/comments?taskId=${id}`)
        ]);
        setTask(taskResponse.data);
        setComments(commentsResponse.data);
        setLoading(false);
      } catch (error: any) {
        console.error('Error fetching task or comments:', error);
        toast.error(`Failed to load task and comments: ${error.message}`);
        setLoading(false);
      }
    };

    fetchTaskAndComments();
  }, [id]);

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        const response = await axios.post('http://localhost:3004/comments', {
          text: newComment,
          taskId: id,
        });
        setComments([...comments, response.data]);
        setNewComment('');
        toast.success('Comment added successfully!');
      } catch (error) {
        toast.error('Failed to add comment');
      }
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await axios.delete(`http://localhost:3004/comments/${commentId}`);
      setComments(comments.filter(comment => comment.id !== commentId));
      toast.success('Comment deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  const handleEditComment = async (commentId: string, updatedText: string) => {
    try {
      await axios.put(`http://localhost:3004/comments/${commentId}`, { text: updatedText });
      setComments(comments.map(comment => (comment.id === commentId ? { ...comment, text: updatedText } : comment)));
      toast.success('Comment updated successfully!');
    } catch (error) {
      toast.error('Failed to update comment');
    }
  };

  if (loading) {
    return <div className="p-2 text-2xl"><Spinner /></div>;
  }

  if (!task) {
    return <div>Task not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Task Detail</h2>

      <div>
        <h3 className="text-xl font-bold">Title: {task.title}</h3>
        <p className="mt-2">Content: {task.content || 'No content provided'}</p>
        <p className="mt-2">Status: {task.completed ? 'Completed' : 'Incomplete'}</p>
      </div>

      <div className="mt-6">
        <button
          onClick={() => navigate({ to: `/posts/${task.id}/edit` })}
          className="bg-yellow-500 text-white px-4 py-2 rounded shadow"
        >
          Edit Task
        </button>
        <button
          onClick={() => navigate({ to: '/' })}
          className="ml-4 bg-gray-500 text-white px-4 py-2 rounded shadow"
        >
          Back to List
        </button>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Comments</h3>

        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment.id} className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between">
              <span>{comment.text}</span>
              <div>
                <button
                  onClick={() => handleEditComment(comment.id, prompt('Edit Comment:', comment.text) || comment.text)}
                  className="text-blue-500 hover:underline mx-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6">
        <label htmlFor="new-comment" className="block text-sm font-medium">Add a comment</label>
          <input
            id="new-comment"
            type="text"
            placeholder="Add a comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full"
          />
          <button
            onClick={handleAddComment}
            className="bg-green-500 text-white px-4 py-2 mt-2 rounded shadow"
          >
            Add Comment
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskDetail;
