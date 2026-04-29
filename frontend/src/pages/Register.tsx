import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { AlertCircle, Code2, Loader2 } from 'lucide-react';
import api from '../utils/api';

const schema = yup.object().shape({
  username: yup.string().required('Username is required').min(3, 'Must be at least 3 characters'),
  email: yup.string().email('Must be a valid email').required('Email is required'),
  password: yup.string().required('Password is required').min(6, 'Must be at least 6 characters'),
  password_confirm: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm your password'),
});

type FormData = yup.InferType<typeof schema>;

export const Register: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Assuming a standard Django view that returns a token or requires login after
      await api.post('/auth/register/', {
        username: data.username,
        email: data.email,
        password: data.password
      });
      // Optionally login right after registration if endpoint supports it, otherwise redirect to login
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed. Username may be taken.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[10%] right-[-5%] w-96 h-96 bg-neon-pink/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-neon-purple/20 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/5 border border-white/10 shadow-[0_0_30px_rgba(176,38,255,0.2)] mb-6"
          >
            <Code2 className="w-10 h-10 text-neon-purple" />
          </motion.div>
          <h2 className="text-4xl font-bold mb-2">Create Account</h2>
          <p className="text-gray-400">Join <span className="text-gradient font-semibold">NeonManage</span> today</p>
        </div>

        <div className="glass-panel p-8">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Username</label>
              <input 
                {...register('username')}
                type="text" 
                className="input-glass w-full"
                placeholder="johndoe"
              />
              {errors.username && <p className="text-neon-pink text-xs mt-1.5">{errors.username.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <input 
                {...register('email')}
                type="email" 
                className="input-glass w-full"
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-neon-pink text-xs mt-1.5">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <input 
                {...register('password')}
                type="password" 
                className="input-glass w-full"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-neon-pink text-xs mt-1.5">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm Password</label>
              <input 
                {...register('password_confirm')}
                type="password" 
                className="input-glass w-full"
                placeholder="••••••••"
              />
              {errors.password_confirm && <p className="text-neon-pink text-xs mt-1.5">{errors.password_confirm.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-primary w-full flex justify-center items-center mt-4"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-neon-purple hover:text-white transition-colors font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
