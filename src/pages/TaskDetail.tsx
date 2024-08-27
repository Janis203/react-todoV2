import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

type Comment = {
  id: string;
  text: string;
  taskId: string;
};

type Task = {
  id: string;
  title: string;
  content?: string;
  completed: boolean;
};

function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null); 
  const [editedText, setEditedText] = useState<string>(""); 

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3004/posts/${id}`)
        .then(response => response.json())
        .then(data => setTask(data));

      fetch(`http://localhost:3004/comments?taskId=${id}`)
        .then(response => response.json())
        .then(data => setComments(data));
    }
  }, [id]);

  const handleAddComment = () => {
    if (!id) return;
    const comment: Comment = { id: (comments.length + 1).toString(), text: newComment, taskId: id };
    fetch('http://localhost:3004/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment),
    })
      .then(() => setComments([...comments, comment]))
      .catch(error => console.error('Error adding comment:', error));
    setNewComment("");
  };

  const handleDeleteComment = (commentId: string) => {
    fetch(`http://localhost:3004/comments/${commentId}`, { method: 'DELETE' })
      .then(() => setComments(comments.filter(c => c.id !== commentId)))
      .catch(error => console.error('Error deleting comment:', error));
  };

  const handleEditComment = (commentId: string) => {
    const commentToEdit = comments.find(c => c.id === commentId);
    if (commentToEdit) {
      setEditingCommentId(commentId);
      setEditedText(commentToEdit.text);
    }
  };

  const handleSaveEditedComment = () => {
    if (!id || !editingCommentId) return;
    fetch(`http://localhost:3004/comments/${editingCommentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingCommentId, text: editedText, taskId: id }),
    })
      .then(() => {
        setComments(comments.map(c => c.id === editingCommentId ? { ...c, text: editedText } : c));
        setEditingCommentId(null);
        setEditedText("");
      })
      .catch(error => console.error('Error updating comment:', error));
  };

  if (!task) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800">{task.title}</h1>
      {task.content && <p className="mt-2 text-gray-700">{task.content}</p>}

      <h2 className="text-xl font-semibold mt-6">Comments</h2>
      <ul className="mt-4 space-y-4">
        {comments.map(comment => (
          <li key={comment.id} className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 transition">
            <span>{comment.text}</span>
            <div className="flex space-x-3">
              <button onClick={() => handleEditComment(comment.id)} className="btn btn-warning px-3 py-1 rounded shadow">Edit</button>
              <button onClick={() => handleDeleteComment(comment.id)} className="btn btn-danger px-3 py-1 rounded shadow">Delete</button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Add Comment</h2>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={4}
          className="w-full mt-2 p-2 border rounded"
        />
        <button
          onClick={handleAddComment}
          className="btn btn-primary mt-2 px-4 py-2 rounded shadow-lg"
        >
          Add Comment
        </button>
      </div>

      {editingCommentId && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Edit Comment</h2>
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            rows={4}
            className="w-full mt-2 p-2 border rounded"
          />
          <button
            onClick={handleSaveEditedComment}
            className="btn btn-primary mt-2 px-4 py-2 rounded shadow-lg"
          >
            Save
          </button>
        </div>
      )}

      <Link to="/" className="mt-4 inline-block text-blue-500">Back to Task List</Link>
    </div>
  );
}

export default TaskDetail;
