import React from 'react';
import Button from '../Button/index';

interface CommentItemProps {
  text: string;
  onEdit: () => void;
  onDelete: () => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ text, onEdit, onDelete }) => {
  return (
    <div className="flex justify-between items-center p-2 border-b">
      <span>{text}</span>
      <div className="space-x-2">
        <Button onClick={onEdit} variant="warning">Edit</Button>
        <Button onClick={onDelete} variant="danger">Delete</Button>
      </div>
    </div>
  );
};

export default CommentItem;
