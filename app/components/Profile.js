'use client';

import { useEffect, useState } from "react";
import { usePathname } from 'next/navigation';
import { useRouter } from "next/navigation";

export function Profile() {
    const pathname = usePathname();
    const router = useRouter();
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
  
          const groupData = await groupResponse.json();
          if (!groupData.result) {
            router.push('/user-not-found');
            return;
          }
  
        } catch (error) {
          console.error('Error checking user:', error);
        }
      };
  
      checkProfile();
    }, [pathname, router]);
    
    return (
        <div>

        </div>
    );
}