import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Edit2, Trash2, Calendar, CheckCircle2, Circle, Clock, Loader2 } from 'lucide-react';
import api from '../utils/api';
import type { Project, Task } from '../types';

export const ProjectDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchProjectAndTasks = async () => {
      try {
        const [projectRes, tasksRes] = await Promise.all([
          api.get(`/projects/${id}/`),
          api.get(`/tasks/?project=${id}`)
        ]);
        setProject(projectRes.data);
        const taskData = tasksRes.data.results || tasksRes.data;
        setTasks(Array.isArray(taskData) ? taskData : []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjectAndTasks();
  }, [id]);

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/projects/${id}/`);
        navigate('/');
      } catch (err) {
        alert('Failed to delete project');
      }
    }
  };

  const handleTaskStatusChange = async (taskId: number, newStatus: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      await api.put(`/tasks/${taskId}/`, { ...task, status: newStatus });
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus as any } : t));
    } catch (err) {
      alert('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('Delete this task?')) {
      try {
        await api.delete(`/tasks/${taskId}/`);
        setTasks(tasks.filter(t => t.id !== taskId));
      } catch (err) {
        alert('Failed to delete task');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <Loader2 className="w-8 h-8 text-neon-blue animate-spin" />
      </div>
    );
  }

  if (!project) return <div className="text-center py-10">Project not found</div>;

  const filteredTasks = tasks.filter(t => filter === 'all' || t.status === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-neon-purple/10 rounded-full blur-[150px] pointer-events-none" />

      <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      <div className="glass-panel p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">{project.title}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
              project.status === 'active' 
                ? 'bg-neon-blue/10 border-neon-blue/30 text-neon-blue' 
                : 'bg-neon-pink/10 border-neon-pink/30 text-neon-pink'
            }`}>
              {project.status}
            </span>
          </div>
          <p className="text-gray-400 max-w-2xl">{project.description}</p>
        </div>
        <div className="flex gap-3">
          <Link to={`/projects/${project.id}/edit`} className="btn-secondary px-4 py-2 flex items-center gap-2">
            <Edit2 className="w-4 h-4" /> Edit
          </Link>
          <button onClick={handleDeleteProject} className="btn-secondary px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/20 flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gradient">Tasks</h2>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <select 
            className="input-glass py-2 bg-[#0a0a0a] min-w-[140px]"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Tasks</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <Link to={`/projects/${project.id}/tasks/new`} className="btn-primary py-2 px-4 flex items-center gap-2 whitespace-nowrap">
            <Plus className="w-4 h-4" /> Add Task
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="glass-panel p-12 text-center text-gray-400">
            No tasks found. Create one to get started!
          </div>
        ) : (
          filteredTasks.map((task, idx) => (
            <motion.div 
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-panel p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-4 flex-grow">
                <button 
                  onClick={() => handleTaskStatusChange(task.id, task.status === 'done' ? 'todo' : 'done')}
                  className="mt-1 flex-shrink-0"
                >
                  {task.status === 'done' ? (
                    <CheckCircle2 className="w-6 h-6 text-neon-blue" />
                  ) : task.status === 'in-progress' ? (
                    <Clock className="w-6 h-6 text-neon-purple" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-500 group-hover:text-neon-blue/50 transition-colors" />
                  )}
                </button>
                <div>
                  <h4 className={`text-lg font-medium mb-1 transition-colors ${task.status === 'done' ? 'text-gray-500 line-through' : 'text-white'}`}>
                    {task.title}
                  </h4>
                  <p className="text-gray-400 text-sm">{task.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t border-white/10 md:border-t-0 pl-10 md:pl-0">
                {task.due_date && (
                  <div className="flex items-center text-sm text-gray-400 whitespace-nowrap">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(task.due_date).toLocaleDateString()}
                  </div>
                )}
                <select
                  value={task.status}
                  onChange={(e) => handleTaskStatusChange(task.id, e.target.value)}
                  className="input-glass py-1 px-2 text-sm bg-transparent border-none hover:bg-white/5 cursor-pointer min-w-[110px]"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link to={`/projects/${project.id}/tasks/${task.id}/edit`} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <button onClick={() => handleDeleteTask(task.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
