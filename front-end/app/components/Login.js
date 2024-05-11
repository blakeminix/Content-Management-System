'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'
import React from 'react';
import { logIn, logOut } from '@/redux/features/auth-slice';
import { useDispatch } from 'react-redux';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter()

    const dispatch = useDispatch();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      // Perform authentication logic here (e.g., send credentials to backend)
      // Replace the following logic with your actual authentication logic
      if (username === 'admin' && password === 'password') {
        // Redirect to dashboard if authentication succeeds
        dispatch(logIn(username));
        router.push('/');
      } else {
        // Show error message or handle unsuccessful login
        console.error('Invalid credentials');
      }
    };
  
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }