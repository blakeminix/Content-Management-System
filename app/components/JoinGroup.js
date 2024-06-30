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
    const [loading2, setLoading2] = useState(true);

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
          if (membershipData.isMember) {
            router.push(`/groups/${gid}`);
          } else {
            setLoading2(false);
          }
        } catch (error) {
          console.error('Error checking group or membership:', error);
        }
      };
  
      getGroupAndCheckMembership();
    }, [pathname, router]);

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
            throw new Error('Get privacy failed');
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
            throw new Error('Get requested failed');
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
            throw new Error('Join failed');
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
          throw new Error('Request failed');
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
          throw new Error('Cancel request failed');
        }

        const data = await response.json();
        setRequested(false);
      } catch (error) {

      }
    };

    if (loading || loading2) {
      return <div className="flex justify-center items-center h-screen"><div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500"></div></div>;
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
                      <button onClick={handleCancelRequest} className="w-full px-6 py-2 mb-6 bg-red-800 text-white font-semibold rounded hover:bg-red-700 transition-colors duration-300">Cancel Request</button>
                    </div>
                  ) : (
                    <button onClick={handleRequest} className="w-full px-6 py-2 mb-6 bg-blue-700 text-white font-semibold rounded hover:bg-blue-600 transition-colors duration-300">Request to Join</button>
                  )}
                </div>
              ) : (
              <button onClick={handleJoin} className="w-full px-6 py-2 mb-6 bg-blue-700 text-white font-semibold rounded hover:bg-blue-600 transition-colors duration-300">Join Group</button>
              )}
            </div>
            <Link href='/dashboard' className='w-full px-6 py-2 mt-8 bg-blue-700 text-white font-semibold rounded hover:bg-blue-600 transition-colors duration-300'>Back to Dashboard</Link>
          </div>
        </main>
      </div>
    );
}
