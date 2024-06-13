'use client';

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from 'next/link';

export function JoinGroup() {
    const router = useRouter();
    const pathname = usePathname();
    const [privacy, setPrivacy] = useState(false);
    const [requested, setRequested] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
            throw new Error('Get posts failed');
          }
  
          const data = await response.json();
          if (!data.result) {
            setPrivacy(false);
          } else {
            setPrivacy(true);
          }
        } catch (error) {
  
        } finally {
          setLoading(false);
        }
      };
  
      const getIsRequested = async () => {
        const parts = pathname.split("/");
        const gid = parts[2];
        try {
          const response = await fetch('/api/getisrequested', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ gid }),
          });
      
          if (!response.ok) {
            throw new Error('Get posts failed');
          }
  
          const data = await response.json();
          if (!data.result) {
            setRequested(false);
          } else {
            setRequested(true);
          }
        } catch (error) {
  
        }
      };
      
      getPrivacy();
      getIsRequested();
    }, [pathname]);

    const handleJoin = async () => {
        const parts = pathname.split("/");
        const gid = parts[2];
        try {
          const response = await fetch('/api/joingroup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ gid }),
          });
      
          if (!response.ok) {
            throw new Error('Get posts failed');
          }

          const data = await response.json();
        } catch (error) {

        }
        router.push(`/groups/${gid}`);
    };

    const handleRequest = async () => {
      const parts = pathname.split("/");
      const gid = parts[2];
      try {
        const response = await fetch('/api/handlerequest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ gid }),
        });
    
        if (!response.ok) {
          throw new Error('Get posts failed');
        }

        const data = await response.json();
        setRequested(true);
      } catch (error) {

      }
    };
    
    const handleCancelRequest = async () => {
      const parts = pathname.split("/");
      const gid = parts[2];
      try {
        const response = await fetch('/api/cancelrequest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ gid }),
        });
    
        if (!response.ok) {
          throw new Error('Get posts failed');
        }

        const data = await response.json();
        setRequested(false);
      } catch (error) {

      }
    };

    if (loading) {
      return <div></div>;
    }
    
    return(
      <div>
        <main className="flex-grow flex flex-col items-center justify-center pt-28 p-10">
          <div className="bg-gray-800 rounded-lg shadow-md p-8 text-center max-w-lg">
            <h1 className="text-2xl font-bold text-white mb-4">Join Group</h1>
            <div>
              {privacy ? (
                <div>
                  {requested ? (
                    <div>
                      <button onClick={handleCancelRequest} className="px-6 py-2 mb-6 bg-red-800 text-white font-semibold rounded hover:bg-red-700 transition-colors duration-300">Cancel Request</button>
                    </div>
                  ) : (
                    <button onClick={handleRequest} className="px-6 py-2 mb-6 bg-blue-700 text-white font-semibold rounded hover:bg-blue-600 transition-colors duration-300">Request to Join</button>
                  )}
                </div>
              ) : (
              <button onClick={handleJoin} className="px-6 py-2 mb-6 bg-blue-700 text-white font-semibold rounded hover:bg-blue-600 transition-colors duration-300">Join Group</button>
              )}
            </div>
            <Link href='/dashboard' className='px-6 py-2 mt-8 bg-blue-700 text-white font-semibold rounded hover:bg-blue-600 transition-colors duration-300'>Back to Dashboard</Link>
          </div>
        </main>
      </div>
    );
}
