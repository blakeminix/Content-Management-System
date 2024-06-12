'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function ProfileDropdown() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const getUsername = async () => {
      try {
        const response = await fetch('/api/getusername', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error('Get username failed');
        }
  
        const data = await response.json();
        setUsername(data.message);
      } catch (error) {
        console.error('Get username failed:', error);
      }
    };

    getUsername();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowDropdown(false);
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  function handleProfile() {
    router.push(`/users/${username}`);
  }

  function handleSettings() {
    router.push('/settings');
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
    router.push('/.');
  };

  return (
    <div className="relative dropdown-container">
      <button
        className="fixed right-10 top-3 p-2 rounded-full bg-gray-700 hover:bg-gray-600 focus:bg-gray-600 text-white w-10 h-10 flex items-center justify-center"
        onClick={() => setShowDropdown(!showDropdown)}
        aria-expanded={showDropdown}
        aria-haspopup="true"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      {showDropdown && (
        <div className="fixed z-50 right-10 mt-5 w-48 rounded-md shadow-lg bg-gray-900 ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <button onClick={handleProfile} className="w-full block px-4 py-2 text-sm text-white hover:bg-gray-800" role="menuitem">My Profile</button>
            <button onClick={handleSettings} className="w-full block px-4 py-2 text-sm text-white hover:bg-gray-800" role="menuitem">Settings</button>
            <button onClick={handleLogout} className="w-full block px-4 py-2 text-sm text-white hover:bg-gray-800 mb-1" role="menuitem">Logout</button>
          </div>
        </div>
      )}
    </div>
  );
}
