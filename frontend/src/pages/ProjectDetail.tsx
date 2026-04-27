import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { PlusIcon, TrashIcon, PencilSquareIcon, ArrowLeftIcon, FunnelIcon } from '@heroicons/react/24/outline';
import api from '../api/axios';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  due_date: string | null;
  project: number;
}

const taskSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string(),
  status: yup.string().oneOf(['todo', 'in-progress', 'done']).required(),
  due_date: yup.string().nullable(),
}).required();

type TaskFormData = yup.InferType<typeof taskSchema>;

export const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<TaskFormData>({
    resolver: yupResolver(taskSchema) as any,
    defaultValues: { status: 'todo' }
  });

  const fetchTasks = async () => {
    try {
      const url = filter ? `tasks/?project_id=${id}&status=${filter}` : `tasks/?project_id=${id}`;
      const response = await api.get(url);
      setTasks(response.data.results || response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [id, filter]);

  const onSubmit = async (data: TaskFormData) => {
    try {
      const payload = { ...data, project: id };
      if (editingTask) {
        await api.put(`tasks/${editingTask.id}/`, payload);
      } else {
        await api.post('tasks/', payload);
      }
      setIsModalOpen(false);
      reset();
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (taskId: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await api.delete(`tasks/${taskId}/`);
      fetchTasks();
    }
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setValue('title', task.title);
    setValue('description', task.description || '');
    setValue('status', task.status as 'todo'|'in-progress'|'done');
    setValue('due_date', task.due_date);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingTask(null);
    reset({ title: '', description: '', status: 'todo', due_date: null });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex items-center space-x-2 text-sm font-bold text-slate-400 hover:text-brand-600 transition-colors w-fit">
        <ArrowLeftIcon className="h-4 w-4" />
        <Link to="/">Back to Projects</Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Project Tasks</h1>
          <p className="text-slate-500 mt-2 text-lg">Track progress and manage individual milestones</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <FunnelIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 pr-8 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all shadow-sm appearance-none cursor-pointer font-bold text-slate-700"
            >
              <option value="">All Tasks</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Completed</option>
            </select>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center px-6 py-3 border border-transparent shadow-lg shadow-brand-200 text-sm font-bold rounded-2xl text-white bg-brand-600 hover:bg-brand-700 active:scale-95 transition-all"
          >
            <PlusIcon className="mr-2 h-5 w-5" />
            Add Task
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {tasks.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center">
            <h3 className="text-xl font-bold text-slate-900">No tasks found</h3>
            <p className="text-slate-500 mt-2">Create a task to get this project moving.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start md:items-center gap-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  task.status === 'done' ? 'bg-emerald-50 text-emerald-600' : 
                  task.status === 'in-progress' ? 'bg-brand-50 text-brand-600' : 'bg-slate-50 text-slate-400'
                }`}>
                   <div className={`w-3 h-3 rounded-full animate-pulse ${
                     task.status === 'done' ? 'bg-emerald-500' : 
                     task.status === 'in-progress' ? 'bg-brand-500' : 'bg-slate-300'
                   }`}></div>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 leading-tight">{task.title}</h4>
                  <p className="text-slate-500 text-sm mt-1">{task.description}</p>
                  {task.due_date && (
                    <span className="inline-flex items-center mt-2 text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-lg">
                      Due: {task.due_date}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEditModal(task)} className="p-3 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all">
                  <PencilSquareIcon className="h-6 w-6" />
                </button>
                <button onClick={() => deleteTask(task.id)} className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                  <TrashIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 transition-all animate-in fade-in duration-300">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg p-8 sm:p-10 animate-in zoom-in-95 duration-300">
            <h3 className="text-3xl font-black text-slate-900 mb-8">
              {editingTask ? 'Edit Task' : 'New Task'}
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Task Title</label>
                <input {...register('title')} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all" />
                <p className="text-red-500 text-xs mt-2 font-medium">{errors.title?.message}</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                <textarea {...register('description')} rows={3} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all resize-none"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
                  <select {...register('status')} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer">
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Due Date</label>
                  <input type="date" {...register('due_date')} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button type="submit" className="flex-1 py-4 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 shadow-lg shadow-brand-100 active:scale-95 transition-all order-1 sm:order-2">
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 active:scale-95 transition-all order-2 sm:order-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
