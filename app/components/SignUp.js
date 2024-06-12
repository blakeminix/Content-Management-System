'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SignUp() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState('');

    const handleSignUp = async (formData) => {
        setErrorMessage('');
        const username = formData.get('username');
        const password = formData.get('password');
        const repeatPassword = formData.get('repeatPassword');

        try {
          const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, repeatPassword }),
          });
    
          if (!response.ok) {
            throw new Error('Signup failed');
          }

          const data = await response.json();

          if (data.response == 1) {
            router.push('/dashboard');
          } else if (data.response == 0) {
            setErrorMessage('Invalid username or password');
          } else if (data.response == 2) {
            setErrorMessage('Username taken');
          } else if (data.response == 3) {
            setErrorMessage('Username must contain only letters and numbers');
          } else if (data.response == 4) {
            setErrorMessage('Password cannot contain spaces');
          } else if (data.response == 5) {
            setErrorMessage('Passwords must match');
          }
        } catch (error) {
          console.error('Signup failed:', error);
        }
    };

    const loginPage = async () => {
        router.push('/.');
    };

    return (
        <section className='min-h-screen h-full flex justify-center'>
        <div className='p-8 rounded-lg max-w-sm md:max-w-md lg:max-w-md w-full mt-2 sm:mt-3 lg:mt-4'>
        <h1 className='text-xl md:text-2xl lg:text-2xl font-bold mb-10 lg:mb-12 text-center'>Content Management System</h1>
        <form
          action={async (formData) => {
            await handleSignUp(formData);
          }}
        >
          <label htmlFor="username" className="block text-sm font-medium text-white mb-3">Username</label>
          <input className="p-4 w-full border rounded-lg mb-6" type="username" name="username" id="username" placeholder="Username" maxLength={30} autoComplete='off'/>
  
          <label htmlFor="password" className="block text-sm font-medium text-white mb-3">Password</label>
          <input className="p-4 w-full border rounded-lg mb-6" type="password" name="password" id="password" placeholder="Password" maxLength={44} autoComplete='off'/>
  
          <label htmlFor="repeatPassword" className="block text-sm font-medium text-white mb-3">Repeat Password</label>
          <input className="p-4 w-full border rounded-lg mb-6" type="password" name="repeatPassword" id="repeatPassword" placeholder="Repeat Password" maxLength={44} autoComplete='off'/>
  
          <button className="h-12 w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-3" type="submit">Sign Up</button>
        </form>

        {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
  
        <div className="border-t border-gray-300 my-4"></div>
  
        <form
          action={async (formData) => {
           await loginPage();
          }}
        >
          <button className="h-12 w-full bg-gray-600 text-white rounded-lg mt-2 hover:bg-gray-700 transition-colors" type="submit">Back to Login</button>
        </form>
        </div>
        </section>
    );
}
