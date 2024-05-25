'use client';

import { useEffect } from "react";
import { usePathname } from 'next/navigation';
import { useRouter } from "next/navigation";

export function CheckGroup() {

    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const getGroup = async () => {
          const parts = pathname.split("/");
          const gid = parts[2];
          try {
            const response = await fetch('http://localhost:3000/api/checkgroup', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ gid }),
            });
      
            if (!response.ok) {
              throw new Error('Get username failed');
            }

            const data = await response.json();
            if (!data.result) {
                router.push('/group-not-found');
            }
            return data;
          } catch (error) {
            console.error('Get username failed:', error);
          }
        }
        
        getGroup();
      }, [pathname, router]);
}