'use client';

import { useEffect, useState } from "react";
import '../globals.css';
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation';

export function GroupSettings() {
  const router = useRouter();
  const pathname = usePathname();
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

        setIsMember(true);
      } catch (error) {
        console.error('Error checking group or membership:', error);
      } finally {
        setLoading(false);
      }
    };

    getGroupAndCheckMembership();
  }, [pathname, router]);

  const handleLeave = async () => {
    const parts = pathname.split("/");
    const gid = parts[2];
    try {
      const response = await fetch('http://localhost:3000/api/leavegroup', {
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
      const response = await fetch('http://localhost:3000/api/deletegroup', {
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
    return <div></div>;
  }

  return (
    <div className='group-row'>
      {isMember && (
        <>
          <button className="login-button" onClick={handleLeave}>Leave Group</button>
          {isOwner && (
            <button className="login-button" onClick={handleDeleteGroup}>Delete Group</button>
          )}
        </>
      )}
    </div>
  );
}