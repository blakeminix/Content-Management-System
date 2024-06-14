'use client';

import { useEffect, useState } from "react";
import { usePathname } from 'next/navigation';
import { useRouter } from "next/navigation";
import Link from 'next/link';

export function Profile() {
    const pathname = usePathname();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const [username, setUsername] = useState('');
    const [groups, setGroups] = useState([]);
    const [description, setDescription] = useState("");
    const [isMe, setIsMe] = useState(false);
  
    useEffect(() => {
      const checkProfile = async () => {
        const parts = pathname.split("/");
        const user = parts[2];
  
        try {
          const groupResponse = await fetch('/api/checkprofile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user }),
          });
  
          if (!groupResponse.ok) {
            throw new Error('Check profile failed');
          }
  
          const data = await groupResponse.json();
          if (!data.result) {
            router.push('/user-not-found');
            return;
          }

          if (data.isMe) {
            setIsMe(true);
          }

          await getProfileGroups(user);
          await getProfileDescription(user);
        } catch (error) {
          console.error('Error checking user:', error);
        } finally {
            setUsername(user);
            setLoading(false);
        }
      };
  
      checkProfile();
    }, [pathname, router]);

    const getProfileGroups = async (user) => {
        try {
          const response = await fetch('/api/getprofilegroups', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user }),
          });
      
          if (!response.ok) {
            throw new Error('Get groups failed');
          }
      
          const data = await response.json();
          const profileGroups = data.groups;
          setGroups(profileGroups);
        } catch (error) {
          console.error('Get groups failed:', error);
        } finally {
          setLoading2(false);
        }
    };

    const getProfileDescription = async (user) => {
        try {
          const response = await fetch('/api/getprofiledescription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user }),
          });
      
          if (!response.ok) {
            throw new Error('Get description failed');
          }
      
          const data = await response.json();
          setDescription(data.description[0][0].description);
        } catch (error) {
          console.error('Get description failed:', error);
        }
    };

    const addProfileDescription = async (formData) => {
        const parts = pathname.split("/");
        const user = parts[2];
        const description = formData.get('description');
        try {
            const response = await fetch('/api/addprofiledescription', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ description, user }),
        });

        if (!response.ok) {
            throw new Error('Add description failed');
        }
            getProfileDescription(user);
        } catch (error) {
            console.error('Add description failed:', error);
        }
        router.refresh();
    };

    const createMarkup = (content) => {
        if (content) {
            const formattedContent = content.replace(/\n/g, '<br/>');
            return { __html: formattedContent };
        }
      };

    if (loading || loading2) {
      return <div className="flex justify-center items-center h-screen"><div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500"></div></div>;
    }
    
    return (
      <div className="min-h-screen p-6 pt-24">
        <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md">
        {isMe ? (
          <div>
          <form
          className="space-y-4"
            action={async (formData) => {
              await addProfileDescription(formData);
            }}
          >
            <textarea className="w-full p-4 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:outline-none bg-gray-950 text-white" type="post" name="description" placeholder="Description" autoComplete="off" rows={5} maxLength={100000} value={description} onChange={(e) => setDescription(e.target.value)}/>
            <button className="w-full bg-blue-700 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition-colors duration-300" type="submit">Upload Description</button>
          </form>
          </div>
        ) :  (
          <div className="max-w-none" dangerouslySetInnerHTML={createMarkup(description)} />
        )}
      </div>
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {groups && groups.length > 0 ? (
              groups.map(group => (
                <Link className="block p-6 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-300" key={group.id} href={`/groups/${group.id}`}>
                  <div className='text-base lg:text-lg font-semibold text-white mb-2'>{group.group_name}</div>
                  <div className='text-sm text-gray-400'>#{group.id}</div>
                </Link>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">No groups available</p>
            )}
          </div>
        </div>
      </div>
    );
}