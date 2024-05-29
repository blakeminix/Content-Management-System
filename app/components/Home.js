'use client';

import { useEffect, useState } from "react";
import '../globals.css'
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

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
        if (!membershipData.result) {
          router.push(`/groups/${gid}/join-group`);
          return;
        }

        await fetchDescription(gid);
      } catch (error) {
        console.error('Error checking group or membership:', error);
      } finally {
        setLoading(false);
      }
    };

    getGroupAndCheckMembership();
  }, [pathname, router]);

  const fetchDescription = async (gid) => {
    try {
      const response = await fetch('http://localhost:3000/api/getdescription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gid }),
      });
  
      if (!response.ok) {
        throw new Error('Get description failed');
      }
  
      const data = await response.json();
      setDescription(data.description[0][0].text);
    } catch (error) {
      console.error('Get description failed:', error);
    }
  };

  const handleDescription = async (formData) => {
    const parts = pathname.split("/");
    const gid = parts[2];
    const description = formData.get('description');
    try {
      const response = await fetch('http://localhost:3000/api/adddescription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description, gid }),
      });

      if (!response.ok) {
        throw new Error('Add description failed');
      }
      fetchDescription(gid);
    } catch (error) {
      console.error('Add description failed:', error);
    }
    router.refresh();
  };

  if (loading) {
    return <div></div>;
  }

  return (
    <div className="post-container">
      <form
        action={async (formData) => {
          await handleDescription(formData);
        }}
      >
        <div className="post-box-container">
          <textarea className="description-box" type="post" name="description" placeholder="Description" autoComplete="off" rows={100} maxLength={100000} value={description} onChange={(e) => setDescription(e.target.value)}/>
          <br />
          <button className="post-button" type="submit">Upload Description</button>
        </div>
      </form>
    </div>
  );
}