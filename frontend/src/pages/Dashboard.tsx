import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, FolderKanban, Clock } from 'lucide-react';
import api from '../utils/api';
import type { Project } from '../types';

export const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects/');
        // Handle paginated response or direct array
        const data = response.data.results || response.data;
        setProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch projects', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Background decorations */}
      <div className="absolute top-[20%] left-[-5%] w-96 h-96 bg-neon-blue/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gradient">Your Projects</h1>
          <p className="text-gray-400">Manage and track your project progress</p>
        </div>
        <Link to="/projects/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          <span>New Project</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : projects.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel flex flex-col items-center justify-center p-12 text-center"
        >
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <FolderKanban className="w-10 h-10 text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
          <p className="text-gray-400 mb-6 max-w-md">Get started by creating your first project to organize your tasks.</p>
          <Link to="/projects/new" className="btn-secondary">
            Create Project
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/projects/${project.id}`} className="block h-full">
                <div className="glass-panel glass-panel-hover p-6 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-white group-hover:text-neon-blue transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      project.status === 'active' 
                        ? 'bg-neon-blue/10 border-neon-blue/30 text-neon-blue' 
                        : 'bg-neon-pink/10 border-neon-pink/30 text-neon-pink'
                    }`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-6 flex-grow line-clamp-3">
                    {project.description}
                  </p>
                  <div className="flex items-center text-gray-500 text-xs border-t border-white/10 pt-4 mt-auto">
                    <Clock className="w-4 h-4 mr-1.5" />
                    <span>Updated {new Date(project.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
