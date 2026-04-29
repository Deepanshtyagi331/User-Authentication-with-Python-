import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import api from '../utils/api';

const schema = yup.object().shape({
  title: yup.string().required('Title is required').max(200, 'Too long'),
  description: yup.string().required('Description is required'),
  status: yup.string().oneOf(['todo', 'in-progress', 'done'] as const).default('todo').required(),
  due_date: yup.string().nullable().defined(),
});

type FormData = yup.InferType<typeof schema>;

export const TaskForm: React.FC = () => {
  const { projectId, taskId } = useParams();
  const isEdit = !!taskId;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { status: 'todo' }
  });

  useEffect(() => {
    if (isEdit) {
      const fetchTask = async () => {
        try {
          const response = await api.get(`/tasks/${taskId}/`);
          reset({
            title: response.data.title,
            description: response.data.description,
            status: response.data.status,
            due_date: response.data.due_date ? response.data.due_date.split('T')[0] : ''
          });
        } catch (err) {
          setError('Failed to load task details.');
        } finally {
          setIsFetching(false);
        }
      };
      fetchTask();
    }
  }, [taskId, isEdit, reset]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const payload: any = { ...data, project: projectId };
      if (!payload.due_date) delete payload.due_date;

      if (isEdit) {
        await api.put(`/tasks/${taskId}/`, payload);
      } else {
        await api.post('/tasks/', payload);
      }
      navigate(`/projects/${projectId}`);
    } catch (err) {
      setError('Failed to save task.');
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-neon-blue animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to={`/projects/${projectId}`} className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Project
      </Link>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8"
      >
        <h2 className="text-3xl font-bold mb-6 text-gradient">{isEdit ? 'Edit Task' : 'New Task'}</h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Task Title</label>
            <input 
              {...register('title')}
              type="text" 
              className="input-glass w-full"
              placeholder="What needs to be done?"
            />
            {errors.title && <p className="text-neon-pink text-xs mt-2">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea 
              {...register('description')}
              rows={4}
              className="input-glass w-full resize-none"
              placeholder="Add more details about this task..."
            />
            {errors.description && <p className="text-neon-pink text-xs mt-2">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select 
                {...register('status')}
                className="input-glass w-full bg-[#0a0a0a] appearance-none"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Due Date (Optional)</label>
              <input 
                {...register('due_date')}
                type="date" 
                className="input-glass w-full"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-primary flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {isEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
