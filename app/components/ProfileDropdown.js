'use client';

import { useState } from "react";
import '../globals.css'
import Link from 'next/link'

export function ProfileDropdown() {
  const [showDropdown, setShowDropdown] = useState(false);

  function toggleDropdown() {
    const dropdown = document.getElementById("dropdown-content");
    dropdown.classList.toggle("show");
  }

    // Must use useEffect + useState to resolve window is not defined error. Functionality works, but error appears.
    // Will also want to add fading animation to the dropdown.
    /*
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
*/
  const handleLogout = async () => {
        
  };

  return (
    <div>
      <button className="prof" onClick={toggleDropdown}></button>
      <div className="dropdown-content" id="dropdown-content">
        <Link href="/[username]" as="/blakeminix">My Profile</Link>
        <Link href="/settings">Settings</Link>
        <a>Dark Mode</a>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
