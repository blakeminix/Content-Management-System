'use client';
import { useRouter, usePathname } from "next/navigation";

export async function LeaveGroup() {
    const router = useRouter();
    const pathname = usePathname();
    
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
            throw new Error('Get posts failed');
          }

          const data = await response.json();
        } catch (error) {

        }
        router.push('/dashboard');
    };
    
    return(
        <div>
            <button onClick={handleLeave}>Leave Group</button>
        </div>
    );
}