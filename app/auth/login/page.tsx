'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { db, ref, set, push, get, child, query, orderByChild, onValue } from '../../firebase/firebase';

export default function Login() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loggedInUserDetails,setLoggedInUserDetails]=useState({})

  const handleLogin = async (data: any) => {
    const { email, password } = data;
    const userKey = email.replace(/\./g, '_');
    const userRef = ref(db, `users/${userKey}`);

    const snapshot = await get(userRef);
    if (!snapshot.exists()) {
      setLoginError('User not found');
      return;
    }

    const loggedInUser = snapshot.val();
    setLoggedInUserDetails(loggedInUser);
    const userId=Object.keys(loggedInUser)[0];
    const userPassword=loggedInUser[userId].password;
    console.log("isLoggedUser--",loggedInUser)
    if (password !== userPassword) {
      setLoginError('Incorrect password');
      return;
    }

    setLoginError(null);  // Clear any previous error
    document.cookie = `token=mocktoken; path=/`;
    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Login to your account</h2>

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
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
                {...register('password', { required: 'Password is required' })}
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
            {loginError && <p className="text-red-600 text-xs mt-2">{loginError}</p>}
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold">
            Login
          </button>
        </form>

        <p className="text-sm mt-4 text-center">
          Don’t have an account?{' '}
          <a href="/auth/signup" className="text-blue-600 underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
