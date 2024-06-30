'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function GroupSettings() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
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
          throw new Error('Check group failed');
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
          throw new Error('Check membership failed');
        }

        const membershipData = await membershipResponse.json();
        if (!membershipData.isMember) {
          router.push(`/groups/${gid}/join-group`);
          return;
        }

        if (membershipData.isOwner) {
          setIsOwner(true);
        }

        setIsMember(true);
        setLoading(false);
      } catch (error) {
        console.error('Error checking group or membership:', error);
      }
    };

    getGroupAndCheckMembership();
  }, [pathname, router]);

  const handleLeave = async () => {
    const parts = pathname.split("/");
    const gid = parts[2];
    try {
      const response = await fetch('/api/leavegroup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gid }),
      });

      if (!response.ok) {
        throw new Error('Leave group failed');
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Leave group failed:', error);
    }
  };

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
    router.push('/dashboard');
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

      <main className="flex-1 p-8 pt-8 mb-6 lg:pl-64 lg:pt-24">
      <div className="w-full mx-auto bg-gray-800 p-8 rounded-lg shadow-md">
      {isMember && (
        <>
          <button className="w-full bg-red-600 text-white font-semibold py-2 rounded-md hover:bg-red-500 transition-colors duration-300 mb-12" onClick={handleLeave}>Leave Group</button>
          {isOwner && (
            <button className="w-full bg-red-800 text-white font-semibold py-2 rounded-md hover:bg-red-700 transition-colors duration-300" onClick={handleDeleteGroup}>Delete Group</button>
          )}
        </>
      )}
      </div>
      </main>
    </div>
  );
}