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
      <h1>Join Group</h1>
      <div>
      {privacy ? (
          <div>
              {requested ? (
                  <div>
                      <button onClick={handleCancelRequest}>Cancel Request</button>
                  </div>
              ) : (
                  <button onClick={handleRequest}>Request to Join</button>
              )}
          </div>
      ) : (
          <button onClick={handleJoin}>Join Group</button>
      )}
      </div>
      <Link href='/dashboard' className='dashboard-link'>Back to Dashboard</Link>
      </div>
    );
}
