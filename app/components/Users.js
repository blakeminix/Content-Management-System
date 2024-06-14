'use client';

import { useEffect, useState, useRef } from "react";
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
  const [privacy, setPrivacy] = useState(false);
  const parts = pathname.split('/');
  const gid = parts[2];

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
        setLoading(false);
      } catch (error) {
        console.error('Error checking group or membership:', error);
      }
    };

    const getPrivacy = async () => {
      const parts = pathname.split("/");
      const gid = parts[2];
      try {
        const response = await fetch('/api/getprivacy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ gid }),
        });
    
        if (!response.ok) {
          throw new Error('Get privacy failed');
        }

        const data = await response.json();
        if (!data.result) {
          setPrivacy(false);
        } else {
          setPrivacy(true);
        }
      } catch (error) {

      }
    };

    getGroupAndCheckMembership();
    getPrivacy();
  }, [pathname, router]);

  const fetchUsers = async () => {
    const parts = pathname.split("/");
    const gid = parts[2];
    try {
      const response = await fetch('/api/getusers', {
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
      const response = await fetch('/api/getrequests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gid }),
      });
  
      if (!response.ok) {
        throw new Error('Get requests failed');
      }
  
      const data = await response.json();
      console.log(data.requests);
      setRequests(data.requests || []);
    } catch (error) {
      console.error('Get requests failed:', error);
    }
  };

  const acceptRequest = async (accept, user) => {
    const parts = pathname.split("/");
    const gid = parts[2];
    try {
      const response = await fetch('/api/acceptrequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gid, accept, user }),
      });
  
      if (!response.ok) {
        throw new Error('Accept request failed');
      }
  
      const data = await response.json();
      fetchRequests();
      fetchUsers();
    } catch (error) {
      console.error('Accept request failed:', error);
    }
  };
  
  const handleMod = async (user) => {
    const parts = pathname.split("/");
    const gid = parts[2];
    try {
      const response = await fetch('/api/handlemod', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gid, user }),
      });
  
      if (!response.ok) {
        throw new Error('Mod failed');
      }
  
      const data = await response.json();
      fetchUsers();
    } catch (error) {
      console.error('Mod failed:', error);
    }
  };

  const removeMod = async (user) => {
    const parts = pathname.split("/");
    const gid = parts[2];
    try {
      const response = await fetch('/api/removemod', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gid, user }),
      });
  
      if (!response.ok) {
        throw new Error('Remove mod failed');
      }
  
      const data = await response.json();
      fetchUsers();
    } catch (error) {
      console.error('Remove mod failed:', error);
    }
  };


  const kickUser = async (user) => {
    const parts = pathname.split("/");
    const gid = parts[2];
    try {
      const response = await fetch('/api/kickuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gid, user }),
      });
  
      if (!response.ok) {
        throw new Error('Kick user failed');
      }
  
      const data = await response.json();
      fetchUsers();
    } catch (error) {
      console.error('Kick user failed:', error);
    }
  };

  if (loading) {
    return (
      <div>
        <aside className="mx-auto w-full lg:w-[calc(20%-1rem)] bg-gray-800 text-white p-4 pt-20 space-y-1 lg:space-y-4 relative lg:fixed left-0 h-80 lg:h-full">
          <Link className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors" href={`/groups/${gid}`}>Home</Link>
          <Link className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors" href={`/groups/${gid}/posts`}>Posts</Link>
          <Link className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors" href={`/groups/${gid}/media`}>Media</Link>
          <Link className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors" href={`/groups/${gid}/users`}>Users</Link>
          <Link className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors" href={`/groups/${gid}/settings`}>Settings</Link>
        </aside>
        <div className="flex justify-center items-center h-screen"><div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500"></div></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row mx-auto w-full max-w-screen-lg lg:px-0 min-h-screen">
      <aside className="mx-auto w-full lg:w-[calc(20%-1rem)] bg-gray-800 text-white p-4 pt-20 space-y-1 lg:space-y-4 relative lg:fixed left-0 h-80 lg:h-full">
        <Link className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors" href={`/groups/${gid}`}>Home</Link>
        <Link className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors" href={`/groups/${gid}/posts`}>Posts</Link>
        <Link className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors" href={`/groups/${gid}/media`}>Media</Link>
        <Link className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors" href={`/groups/${gid}/users`}>Users</Link>
        <Link className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors" href={`/groups/${gid}/settings`}>Settings</Link>
      </aside>

    <div className="flex-grow p-4 lg:ml-[20%]">
    {isMember && (
    <>
    <div className="mb-8 mt-6 lg:mt-20">
      <div className="mb-4 text-lg font-semibold text-white">Users: {users.length}</div>
      {users && users.length > 0 ? (
        users.map(user => (
          <div className="mb-2 flex items-right justify-between bg-gray-800 p-3 rounded" key={user}>
            <Link href={`/users/${user.username}`} className="text-blue-400 hover:underline">{user.username}</Link>
            {isOwner && !user.isModerator && !user.isMe && (
              <button onClick={() => handleMod(user.username)} className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-500">Mod</button>
            )}
            {isOwner && user.isModerator && !user.isMe && (
              <button onClick={() => removeMod(user.username)} className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-500">Remove Mod</button>
            )}
            {((isOwner || (isModerator && !user.isModerator)) && !user.isMe) && (
              <button onClick={() => kickUser(user.username)} className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-500">Kick</button>
            )}
          </div>
        ))
      ) : (
        <p></p>
      )}
      </div>

    {privacy && isModerator && (
    <div className="mb-8 mt-16">
      <div className="mb-4 text-lg font-semibold text-white">Requests: {requests.length}</div>
      {requests && requests.length > 0 ? (
        requests.map(user => (
          <div className="mb-2 flex items-right justify-between bg-gray-800 p-3 rounded" key={user}>
            <Link href={`/users/${user}`} className="text-blue-400 hover:underline">{user}</Link>
            <button onClick={() => acceptRequest(true, user)} className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-500">Accept</button>
            <button onClick={() => acceptRequest(false, user)} className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-500">Decline</button>
          </div>
        ))
      ) : (
        <p></p>
      )}
      </div>
      )}
      </>
    )}
    </div>
    </div>
  );
}
