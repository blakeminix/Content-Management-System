'use client';

import { useEffect, useState } from "react";
import '../globals.css'
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation';

export function Posts() {
  const router = useRouter();
  const pathname = usePathname();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, [pathname]);

  const fetchPosts = async () => {
    const parts = pathname.split("/");
    const gid = parts[2];
    try {
      const response = await fetch('http://localhost:3000/api/getposts', {
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
      const reversedPosts = data.posts.slice().reverse();
      setPosts(reversedPosts);
    } catch (error) {
      console.error('Get posts failed:', error);
    }
  };

  const handlePost = async (formData) => {
    const parts = pathname.split("/");
    const gid = parts[2];
    const post = formData.get('post');
    try {
      const response = await fetch('http://localhost:3000/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ post, gid }),
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }
      fetchPosts();
    } catch (error) {
      console.error('Logout failed:', error);
    }
    router.refresh();
  };

  return (
    <div className="post-container">
    <div className='post-list'>
      {posts && posts.length > 0 ? (
        posts.slice().reverse().map(post => (
          <div className="post" key={post.id}>
            <div className="post-username">{post.username}</div>
            <div className="post-content">{post.content}</div>
          </div>
        ))
      ) : (
        <p></p>
      )}
        <form
        action={async (formData) => {
          await handlePost(formData);
        }}
        >
        <div className="post-box-container">
        <input className="post-box" type="post" name="post" placeholder="Post" maxLength={159} autoComplete="off"/>
        <br />
        <button className="post-button" type="submit">Post</button>
        </div>
      </form>
    </div>
    </div>
  );
}
