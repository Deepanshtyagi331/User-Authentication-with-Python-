export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  status: 'active' | 'completed';
  created_at: string;
  updated_at: string;
  owner?: number;
}

export interface Task {
  id: number;
  project: number;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  due_date: string | null;
  created_at: string;
  updated_at: string;
}
