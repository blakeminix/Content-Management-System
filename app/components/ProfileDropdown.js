'use client';

import { useEffect, useState } from "react";
import '../globals.css'
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation'

// Might be good to add a "dark mode" slider here later, as well as a dark mode setting in settings.
export function ProfileDropdown() {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState('');
  const pathname = usePathname()

  function toggleDropdown() {
    const dropdown = document.getElementById("dropdown-content");
    dropdown.classList.toggle("show");
  }

  useEffect(() => {
    window.onclick = function(event) {
      if (!event.target.matches('.prof')) {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
          const dropdown = dropdowns[i];
          if (dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
          }
        }
      }
    }
    router.refresh();
  }, []);

  useEffect(() => {
    const getUsername = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/getusername', {
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
    }
    
    getUsername();
  }, []);

  function handleProfile() {
    router.push(`/users/${username}`);
  }

  function handleSettings() {
    router.push('/settings');
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/logout', {
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
    <div>
      <button className="prof" onClick={toggleDropdown}></button>
      <div className="dropdown-content" id="dropdown-content">
        <button className="dropdown-button" onClick={handleProfile}>My Profile</button>
        <button className="dropdown-button" onClick={handleSettings}>Settings</button>
        <button className="dropdown-button" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
