import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { PlusIcon, TrashIcon, PencilSquareIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import api from '../api/axios';

interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
}

const projectSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  status: yup.string().oneOf(['active', 'completed']).required(),
}).required();

type ProjectFormData = yup.InferType<typeof projectSchema>;

export const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProjectFormData>({
    resolver: yupResolver(projectSchema) as any,
    defaultValues: { status: 'active' }
  });

  const fetchProjects = async () => {
    try {
      const response = await api.get(`projects/?search=${search}`);
      setProjects(response.data.results || response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [search]);

  const onSubmit = async (data: ProjectFormData) => {
    try {
      if (editingProject) {
        await api.put(`projects/${editingProject.id}/`, data);
      } else {
        await api.post('projects/', data);
      }
      setIsModalOpen(false);
      reset();
      setEditingProject(null);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProject = async (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await api.delete(`projects/${id}/`);
      fetchProjects();
    }
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setValue('title', project.title);
    setValue('description', project.description);
    setValue('status', project.status as 'active'|'completed');
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingProject(null);
    reset({ title: '', description: '', status: 'active' });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Your Projects</h1>
          <p className="text-slate-500 mt-2 text-lg">Manage and track your active workflows</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group flex-1 md:w-64">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
            <input
              type="text"
              placeholder="Filter projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl w-full focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all shadow-sm"
            />
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center px-6 py-3 border border-transparent shadow-lg shadow-brand-200 text-sm font-bold rounded-2xl text-white bg-brand-600 hover:bg-brand-700 active:scale-95 transition-all"
          >
            <PlusIcon className="mr-2 h-5 w-5" />
            Create New
          </button>
        </div>
      </div>

      {projects.length === 0 && !search ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
               <PlusIcon className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No projects yet</h3>
            <p className="text-slate-500 mt-2">Start by creating your first project to organize your tasks.</p>
            <button onClick={openCreateModal} className="mt-6 text-brand-600 font-bold hover:text-brand-700">Create Project →</button>
          </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
              <div className="p-8 flex-1">
                <div className="flex justify-between items-start mb-6">
                  <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                    project.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {project.status}
                  </span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditModal(project)} className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all">
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => deleteProject(project.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <Link to={`/project/${project.id}`} className="block group/link">
                  <h3 className="text-2xl font-bold text-slate-900 group-hover/link:text-brand-600 transition-colors line-clamp-1">{project.title}</h3>
                  <p className="mt-4 text-slate-600 leading-relaxed line-clamp-3 text-sm">{project.description}</p>
                </Link>
              </div>
              
              <div className="px-8 py-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/50">
                <Link to={`/project/${project.id}`} className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors flex items-center">
                  View Details
                  <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 transition-all animate-in fade-in duration-300">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg p-8 sm:p-10 animate-in zoom-in-95 duration-300">
            <h3 className="text-3xl font-black text-slate-900 mb-8">
              {editingProject ? 'Edit Project' : 'New Project'}
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
                <input {...register('title')} placeholder="e.g. Marketing Launch" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all" />
                <p className="text-red-500 text-xs mt-2 font-medium">{errors.title?.message}</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                <textarea {...register('description')} rows={4} placeholder="Describe your project goals..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all resize-none"></textarea>
                <p className="text-red-500 text-xs mt-2 font-medium">{errors.description?.message}</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
                <select {...register('status')} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer">
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button type="submit" className="flex-1 py-4 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 shadow-lg shadow-brand-100 active:scale-95 transition-all order-1 sm:order-2">
                  {editingProject ? 'Save Changes' : 'Create Project'}
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
