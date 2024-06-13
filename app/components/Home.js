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
  const [isMember, setIsMember] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
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

        await fetchDescription(gid);
        setIsMember(true);
        setLoading(false);
      } catch (error) {
        console.error('Error checking group or membership:', error);
      }
    };

    getGroupAndCheckMembership();
  }, [pathname, router]);

  const fetchDescription = async (gid) => {
    try {
      const response = await fetch('/api/getdescription', {
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
      const response = await fetch('/api/adddescription', {
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

  const createMarkup = (content) => {
    const formattedContent = content.replace(/\n/g, '<br/>');
    return { __html: formattedContent };
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500"></div></div>;
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
          {isOwner ? (
            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              await handleDescription(formData);
            }}>
              <textarea
                className="w-full p-4 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
                name="description"
                placeholder="Description"
                autoComplete="off"
                rows={15}
                maxLength={100000}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <button
                className="w-full bg-blue-700 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
                type="submit"
              >
                Upload Description
              </button>
            </form>
          ) : isMember ? (
            <div className="max-w-none" dangerouslySetInnerHTML={createMarkup(description)} />
          ) : (
            <p></p>
          )}
        </div>
      </main>
    </div>
  );
}
