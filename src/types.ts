export interface Task {
    id: string;
    title: string;
    content: string;
    completed: boolean;
  }
  
  export interface Comment {
    id: string;
    text: string;
    taskId: string;
  }
  