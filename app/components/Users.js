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
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const getGroupAndCheckMembership = async () => {
      const parts = pathname.split("/");
      const gid = parts[2];

      try {
        const groupResponse = await fetch('/api/checkgroup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ gid }),
        });

        if (!groupResponse.ok) {
          throw new Error('Get group failed');
        }

        const groupData = await groupResponse.json();
        if (!groupData.result) {
          router.push('/group-not-found');
          return;
        }

        const membershipResponse = await fetch('/api/checkmembership', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ gid }),
        });

        if (!membershipResponse.ok) {
          throw new Error('Get membership failed');
        }

        const membershipData = await membershipResponse.json();
        if (!membershipData.isMember) {
          router.push(`/groups/${gid}/join-group`);
          return;
        }

        if (membershipData.isOwner) {
          setIsOwner(true);
        }

        if (membershipData.isModerator) {
          setIsModerator(true);
        }

        await fetchUsers();
        await fetchRequests();
        setIsMember(true);
      } catch (error) {
        console.error('Error checking group or membership:', error);
      } finally {
        setLoading(false);
      }
    };

    getGroupAndCheckMembership();
  }, [pathname, router]);

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
      const reversedUsers = data.users;
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

  const kickUser = async (user) => {
    const parts = pathname.split("/");
    const gid = parts[2];
    try {
      const response = await fetch('http://localhost:3000/api/kickuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gid, user }),
      });
  
      if (!response.ok) {
        throw new Error('Get users failed');
      }
  
      const data = await response.json();
      fetchUsers();
    } catch (error) {
      console.error('Get users failed:', error);
    }
  };

  if (loading) {
    return <div></div>;
  }

  return (
    <div className="post-container">
    {isMember && (
    <><div className='post-list'>
    <div className="post">
      <div className="post-content">Users: {users.length}</div>
    </div>
      {users && users.length > 0 ? (
        users.map(user => (
          <div className="post" key={user}>
            <Link href={`/users/${user.username}`} className="post-username">{user.username}</Link>
            {((isOwner || (isModerator && !user.isModerator)) && !user.isMe) && (
              <button onClick={() => kickUser(user.username)} className="delete-button">Kick</button>
            )}
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
      </div></>
    )}
    </div>
  );
}
