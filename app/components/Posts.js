'use client';

import { useEffect, useState, useRef } from "react";
import '../globals.css'
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function Posts() {
  const router = useRouter();
  const pathname = usePathname();
  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState("");
  const postListRef = useRef(null);

  useEffect(() => {
    fetchPosts();
  }, [pathname]);

  useEffect(() => {
    if (postListRef.current) {
      postListRef.current.scrollTop = postListRef.current.scrollHeight;
    }
  }, [posts]);

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
      setPostContent("");
    } catch (error) {
      console.error('Logout failed:', error);
    }
    router.refresh();
  };

  const deletePost = async (postid) => {
    try {
      const response = await fetch('http://localhost:3000/api/deletepost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postid }),
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }
      fetchPosts();
    } catch (error) {
      console.error('Logout failed:', error);
    }
    router.refresh();
  }

  const createMarkup = (content) => {
    const formattedContent = content.replace(/\n/g, '<br/>');
    return { __html: formattedContent };
  };

  return (
    <div className="post-container">
    <div ref={postListRef} className='post-list'>
      {posts && posts.length > 0 ? (
        posts.slice().reverse().map(post => (
          <div className="post" key={post.id}>
            <Link href={`/users/${post.username}`} className="post-username">{post.username}</Link>
            <div className="post-username">{post.created_at}</div>
            <div className="post-content" dangerouslySetInnerHTML={createMarkup(post.content)} />
            <br />
            <button onClick={() => deletePost(post.id)} className="delete-button">Delete</button>
          </div>
        ))
      ) : (
        <p></p>
      )}
      </div>
        <form
        action={async (formData) => {
          await handlePost(formData);
        }}
        >
        <div className="post-box-container">
        <textarea className="post-box" type="post" name="post" placeholder="Post" autoComplete="off" rows={3} maxLength={10000} value={postContent} onChange={(e) => setPostContent(e.target.value)}/>
        <br />
        <button className="post-button" type="submit">Post</button>
        </div>
      </form>
    </div>
  );
}
