'use client';

import '../globals.css'
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation';

export function DeleteGroup() {
  const router = useRouter();
  const pathname = usePathname()

  const handleDeleteGroup = async () => {
    const parts = pathname.split("/");
    const gid = parts[2];
    try {
      const response = await fetch('/api/deletegroup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gid }),
      });

      if (!response.ok) {
        throw new Error('Delete group failed');
      }
    } catch (error) {
      console.error('Delete group failed:', error);
    }
    router.refresh();
    router.push('/dashboard');
  };

  return (
    <div className='group-row'>
        <button className="login-button" onClick={handleDeleteGroup}>Delete Group</button>
    </div>
  );
}
