import React from 'react';
import Button from '../Button/index';

interface TaskItemProps {
  title: string;
  completed: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ title, completed, onEdit, onDelete }) => {
  return (
    <div className="flex justify-between items-center p-4 border rounded-lg bg-white shadow-sm mb-2">
      <span className={completed ? 'line-through text-gray-500' : ''}>{title}</span>
      <div className="space-x-2">
        <Button onClick={onEdit} variant="warning">Edit</Button>
        <Button onClick={onDelete} variant="danger">Delete</Button>
      </div>
    </div>
  );
};

export default TaskItem;
