'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export function Login() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setLoading(true);

        const formData = new FormData(event.target);
        const username = formData.get('username');
        const password = formData.get('password');

        try {
          const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          });
    
          if (!response.ok) {
            throw new Error('Login failed');
          }

          const data = await response.json();

          if (data.response == 1) {
            router.push('/dashboard');
          } else {
            setLoading(false);
            setErrorMessage('Invalid username or password');
          }
        } catch (error) {
          console.error('Login failed:', error);
        }
    };

    const signUpPage = async () => {
        router.push('/signup');
    };

    return (
        <section className='min-h-screen h-full flex justify-center'>
        <div className='p-8 rounded-lg max-w-sm md:max-w-md lg:max-w-md w-full mt-4 sm:mt-8 lg:mt-12'>
          <h1 className='text-xl md:text-2xl lg:text-2xl font-bold mb-12 lg:mb-16 text-center text-white'>Content Management System</h1>
          <form onSubmit={handleLogin}>
            <label htmlFor="username" className="block text-sm font-medium text-white mb-3">Username</label>
            <input className="p-4 w-full border rounded-lg mb-6 bg-gray-950 text-white" type="text" name="username" id="username" placeholder="Username" autoComplete="username" autoCapitalize="off" required/>
  
            <label htmlFor="password" className="block text-sm font-medium text-white mb-3">Password</label>
            <input className="p-4 w-full border rounded-lg mb-10 bg-gray-950 text-white" type="password" name="password" id="password" placeholder="Password" autoComplete="current-password" autoCapitalize="off" required/>
  
            <button className="h-12 w-full bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition-colors mb-3" type="submit">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
  
          <div className="border-t border-gray-300 my-6"></div>
  
          <form
            action={async () => {
              await signUpPage();
            }}
          >
            <button className="h-12 w-full bg-gray-800 text-white rounded-lg mt-2 hover:bg-gray-700 transition-colors" type="submit">Don't have an account? Sign Up</button>
          </form>
        </div>
        </section>
    );
}
