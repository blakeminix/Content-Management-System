'use client';

import { useEffect, useState, useRef } from "react";
import '../globals.css'
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchDescription();
  }, [pathname]);

  const fetchDescription = async () => {
    const parts = pathname.split("/");
    const gid = parts[2];
    try {
      const response = await fetch('http://localhost:3000/api/getdescription', {
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
      setDescription(data.description[0][0].text);
    } catch (error) {
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
        throw new Error('Logout failed');
      }
      fetchDescription();
    } catch (error) {
      console.error('Logout failed:', error);
    }
    router.refresh();
  };

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
