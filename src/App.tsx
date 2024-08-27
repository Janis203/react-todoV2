import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import TaskList from './pages/TaskList';
import TaskDetail from './pages/TaskDetail';
import TaskForm from './pages/TaskForm';

function App() {
  return (
    <Router>
      <div className="container mx-auto p-4">
        <nav>
          <Link to="/" className="text-lg font-bold">Task Manager</Link>
        </nav>
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/posts/add" element={<TaskForm />} />
          <Route path="/posts/:id" element={<TaskDetail />} />
          <Route path="/posts/:id/edit" element={<TaskForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
