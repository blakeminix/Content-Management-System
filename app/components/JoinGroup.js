'use client';
import { useRouter, usePathname } from "next/navigation";

export async function JoinGroup() {
    const router = useRouter();
    const pathname = usePathname();
    
    const handleJoin = async () => {
        const parts = pathname.split("/");
        const gid = parts[2];
        try {
          const response = await fetch('http://localhost:3000/api/joingroup', {
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
    
    return(
        <div>
            <button onClick={handleJoin}>Join Group</button>
        </div>
    );
}