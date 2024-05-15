'use client';

import { useState } from "react";
import '../globals.css'
import Link from 'next/link'
import { useRouter } from "next/navigation";


// Might be good to add a "dark mode" slider here later, as well as a dark mode setting in settings.
export function ProfileDropdown() {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  function toggleDropdown() {
    const dropdown = document.getElementById("dropdown-content");
    dropdown.classList.toggle("show");
  }

    // Must use useEffect + useState to resolve window is not defined error. Functionality works, but error appears.
    // Will also want to add fading animation to the dropdown.
    
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


function handleProfile() {
  router.push("/users/admin");
}

function handleSettings() {
  router.push('/settings');
}

const handleLogout = async () => {
  console.log("handlelogout");
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

    // Optionally, you can perform additional actions after logout, such as redirecting the user to a login page.
  } catch (error) {
    // Handle any errors that occur during the logout process
    console.error('Logout failed:', error);
  }
  router.push('/.');
};

  return (
    <div>
      <button className="prof" onClick={toggleDropdown}></button>
      <div className="dropdown-content" id="dropdown-content">
        <button className="dropdown-button" onClick={handleProfile}>Profile</button>
        <button className="dropdown-button" onClick={handleSettings}>Settings</button>
        <button className="dropdown-button" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
