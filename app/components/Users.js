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
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchRequests();
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
      setUsers(reversedUsers || []);
    } catch (error) {
      console.error('Get users failed:', error);
    }
  };

  const fetchRequests = async () => {
    const parts = pathname.split("/");
    const gid = parts[2];
    try {
      const response = await fetch('http://localhost:3000/api/getrequests', {
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
      console.log(data.requests);
      setRequests(data.requests || []);
    } catch (error) {
      console.error('Get users failed:', error);
    }
  };

  const acceptRequest = async (accept, user) => {
    const parts = pathname.split("/");
    const gid = parts[2];
    try {
      const response = await fetch('http://localhost:3000/api/acceptrequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gid, accept, user }),
      });
  
      if (!response.ok) {
        throw new Error('Get users failed');
      }
  
      const data = await response.json();
      fetchRequests();
      fetchUsers();
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

    <div className='post-list'>
    <div className="post">
      <div className="post-content">Requests: {requests.length}</div>
    </div>
      {requests && requests.length > 0 ? (
        requests.map(user => (
          <div className="post" key={user}>
            <Link href={`/users/${user}`} className="post-username">{user}</Link>
            <button onClick={() => acceptRequest(true, user)} className="accept-button">Accept</button>
            <button onClick={() => acceptRequest(false, user)} className="delete-button">Decline</button>
          </div>
        ))
      ) : (
        <p></p>
      )}
      </div>
    </div>
  );
}
