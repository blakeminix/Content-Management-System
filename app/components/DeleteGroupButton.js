'use client';

import { useEffect, useState } from "react";
import '../globals.css'
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation'

export function DeleteGroup() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const pathname = usePathname()

  const handleDeleteGroup = async () => {
    const parts = pathname.split("/");
    const gid = parts[2];
    try {
      const response = await fetch('http://localhost:3000/api/deletegroup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gid }),
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
    router.push('/dashboard');
  };

  return (
    <div className='group-row'>
        <button className="login-button" onClick={handleDeleteGroup}>Delete Group</button>
    </div>
  );
}
