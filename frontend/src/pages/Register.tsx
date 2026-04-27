import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import api from '../api/axios';
import { useState } from 'react';

const schema = yup.object({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup.string().email('Must be a valid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
}).required();

type FormData = yup.InferType<typeof schema>;

export const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema) as any
  });
  const [apiError, setApiError] = useState('');
  const token = useAuthStore(state => state.token);
  const navigate = useNavigate();

  if (token) return <Navigate to="/" replace />;

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('auth/register/', data);
      navigate('/login');
    } catch (err: any) {
      setApiError('Registration failed. Email might be taken.');
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50 w-full animate-in fade-in duration-700">
      <div className="hidden lg:flex flex-col justify-center px-12 bg-brand-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-brand-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-accent-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-brand-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative">
          <h1 className="text-5xl font-extrabold text-white leading-tight">
            Join the <br /> <span className="text-brand-400">Future</span> of Workflow.
          </h1>
          <p className="mt-6 text-xl text-brand-100 max-w-md">
            Seamlessly coordinate your team, automate tasks, and hit your milestones faster.
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 bg-white">
        <div className="max-w-md w-full mx-auto">
          <div className="text-left mb-10">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Create Account</h2>
            <p className="mt-2 text-slate-500">Fill in the details to get started</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {apiError && (
              <div className="text-red-500 text-sm font-medium bg-red-50 p-4 rounded-xl border border-red-100 animate-in slide-in-from-top-2">
                {apiError}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700">First name</label>
                  <input
                    {...register("first_name")}
                    className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                  />
                  <p className="text-red-500 text-xs mt-1 font-medium">{errors.first_name?.message}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Last name</label>
                  <input
                    {...register("last_name")}
                    className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                  />
                  <p className="text-red-500 text-xs mt-1 font-medium">{errors.last_name?.message}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">Email address</label>
                <input
                  {...register("email")}
                  placeholder="john@example.com"
                  className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                />
                <p className="text-red-500 text-xs mt-1 font-medium">{errors.email?.message}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">Password</label>
                <input
                  type="password"
                  {...register("password")}
                  placeholder="••••••••"
                  className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                />
                <p className="text-red-500 text-xs mt-1 font-medium">{errors.password?.message}</p>
              </div>
            </div>

            <button type="submit" className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-200 active:scale-[0.98] transition-all">
              Create account
            </button>

            <div className="text-center mt-8">
              <p className="text-sm text-slate-600">
                Already have an account? 
                <Link to="/login" className="ml-1 font-bold text-brand-600 hover:text-brand-700 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
