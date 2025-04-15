'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { db, ref, set, push, get, child, query, orderByChild, onValue } from '../../firebase/firebase';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


export default function Signup() {
    const router = useRouter();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    
    const handleSignup = async (data) => {
      const { email, name, password } = data;
      const userKey = email.replace(/\./g, '_');
      const userRef = ref(db, `users/${userKey}`);
  
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        alert('User already exists');
        return;
      }

  
      await push(userRef, { email, name, password });
      document.cookie = `token=mocktoken; path=/`;
      router.push('/auth/login');
    };
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Create your account</h2>
          
          <form onSubmit={handleSubmit(handleSignup)} className="space-y-5">
            <div>
              <label className="block text-sm">Full Name</label>
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && <p className="text-red-600 text-xs">{errors.name.message}</p>}
            </div>
  
            <div>
              <label className="block text-sm">Email</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && <p className="text-red-600 text-xs">{errors.email.message}</p>}
            </div>
  
            <div>
              <label className="block text-sm">Password</label>
              <div className="relative">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required', minLength: 6 })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <div
                  className="absolute right-3 top-3 cursor-pointer"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
              {errors.password && <p className="text-red-600 text-xs">{errors.password.message}</p>}
            </div>
  
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold">
              Sign Up
            </button>
          </form>
  
          <p className="text-sm mt-4 text-center">
            Already have an account?{' '}
            <a href="/auth/login" className="text-blue-600 underline">
              Sign In
            </a>
          </p>
        </div>
      </div>
    );
}
