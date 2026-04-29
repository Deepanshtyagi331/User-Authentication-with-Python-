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
  status: yup.string().oneOf(['active', 'completed']).default('active')
});

type FormData = yup.InferType<typeof schema>;

export const ProjectForm: React.FC = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { status: 'active' }
  });

  useEffect(() => {
    if (isEdit) {
      const fetchProject = async () => {
        try {
          const response = await api.get(`/projects/${id}/`);
          reset({
            title: response.data.title,
            description: response.data.description,
            status: response.data.status
          });
        } catch (err) {
          setError('Failed to load project details.');
        } finally {
          setIsFetching(false);
        }
      };
      fetchProject();
    }
  }, [id, isEdit, reset]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      if (isEdit) {
        await api.put(`/projects/${id}/`, data);
        navigate(`/projects/${id}`);
      } else {
        const res = await api.post('/projects/', data);
        navigate(`/projects/${res.data.id}`);
      }
    } catch (err) {
      setError('Failed to save project.');
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
      <Link to={isEdit ? `/projects/${id}` : '/'} className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Link>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8"
      >
        <h2 className="text-3xl font-bold mb-6 text-gradient">{isEdit ? 'Edit Project' : 'New Project'}</h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Project Title</label>
            <input 
              {...register('title')}
              type="text" 
              className="input-glass w-full"
              placeholder="E.g., Redesign Website"
            />
            {errors.title && <p className="text-neon-pink text-xs mt-2">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea 
              {...register('description')}
              rows={4}
              className="input-glass w-full resize-none"
              placeholder="What is this project about?"
            />
            {errors.description && <p className="text-neon-pink text-xs mt-2">{errors.description.message}</p>}
          </div>

          {isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select 
                {...register('status')}
                className="input-glass w-full bg-[#0a0a0a] appearance-none"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-primary flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {isEdit ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
