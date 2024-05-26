'use client';

import { useEffect, useState, useRef } from "react";
import '../globals.css'
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function Users() {
  const router = useRouter();
  const pathname = usePathname();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, [pathname]);

  const fetchUsers = async () => {
    const parts = pathname.split("/");
    const gid = parts[2];
    try {
      const response = await fetch('http://localhost:3000/api/getusers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gid }),
      });
  
      if (!response.ok) {
        throw new Error('Get users failed');
      }
  
      const data = await response.json();
      const reversedUsers = data.users[0].users_in_group;
      setUsers(reversedUsers);
    } catch (error) {
      console.error('Get users failed:', error);
    }
  };

  return (
    <div className="post-container">
    <div className='post-list'>
    <div className="post">
      <div className="post-content">Users: {users.length}</div>
    </div>
      {users && users.length > 0 ? (
        users.map(user => (
          <div className="post" key={user}>
            <Link href={`/users/${user}`} className="post-username">{user}</Link>
          </div>
        ))
      ) : (
        <p></p>
      )}
      </div>
    </div>
  );
}
