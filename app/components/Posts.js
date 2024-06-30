'use client';

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function Posts() {
  const router = useRouter();
  const pathname = usePathname();
  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState("");
  const postListRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const parts = pathname.split('/');
  const gid = parts[2];

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
        if (!membershipData.isMember) {
          router.push(`/groups/${gid}/join-group`);
          return;
        }

        if (membershipData.isOwner) {
          setIsOwner(true);
        }

        if (membershipData.isModerator) {
          setIsModerator(true);
        }

        await fetchPosts(gid);
        setIsMember(true);
        setLoading(false);
      } catch (error) {
        console.error('Error checking group or membership:', error);
      }
    };

    getGroupAndCheckMembership();
  }, [pathname, router]);

  useEffect(() => {
    if (postListRef.current) {
      postListRef.current.scrollTop = postListRef.current.scrollHeight;
    }
  }, [posts]);

  const fetchPosts = async () => {
    const parts = pathname.split("/");
    const gid = parts[2];
    try {
      const response = await fetch('/api/getposts', {
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
      const response = await fetch('/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ post, gid }),
      });

      if (!response.ok) {
        throw new Error('Post failed');
      }
      fetchPosts();
      setPostContent("");
    } catch (error) {
      console.error('Post failed:', error);
    }
    router.refresh();
  };

  const deletePost = async (postid) => {
    try {
      const response = await fetch('/api/deletepost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postid }),
      });

      if (!response.ok) {
        throw new Error('Delete post failed');
      }
      fetchPosts();
    } catch (error) {
      console.error('Delete post failed: ', error);
    }
    router.refresh();
  }

  const createMarkup = (content) => {
    const formattedContent = content.replace(/\n/g, '<br/>');
    return { __html: formattedContent };
  };

  if (loading) {
    return (
      <div>
        <aside className="mx-auto w-full lg:w-[calc(20%-1rem)] bg-gray-800 text-white p-4 pt-20 space-y-1 lg:space-y-4 relative lg:fixed left-0 h-80 lg:h-full">
          <Link className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors" href={`/groups/${gid}`}>Home</Link>
          <Link className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors" href={`/groups/${gid}/posts`}>Posts</Link>
          <Link className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors" href={`/groups/${gid}/media`}>Media</Link>
          <Link className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors" href={`/groups/${gid}/users`}>Users</Link>
          <Link className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors" href={`/groups/${gid}/settings`}>Settings</Link>
        </aside>
        <div className="flex justify-center items-center h-screen"><div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500"></div></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row mx-auto w-full max-w-screen-lg lg:px-0 min-h-screen">
      <aside className="mx-auto w-full lg:w-[calc(20%-1rem)] bg-gray-800 text-white p-4 pt-20 space-y-1 lg:space-y-4 relative lg:fixed left-0 h-80 lg:h-full">
        <Link className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors" href={`/groups/${gid}`}>Home</Link>
        <Link className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors" href={`/groups/${gid}/posts`}>Posts</Link>
        <Link className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors" href={`/groups/${gid}/media`}>Media</Link>
        <Link className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors" href={`/groups/${gid}/users`}>Users</Link>
        <Link className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors" href={`/groups/${gid}/settings`}>Settings</Link>
      </aside>

    <div className="flex-grow p-4 lg:ml-[20%]">
    {isMember && (
    <><div ref={postListRef} className='mb-8 mt-6 lg:mt-20'>
          {posts && posts.length > 0 ? (
            posts.slice().reverse().map(post => (
              <div className="mb-2 bg-gray-800 p-6 rounded" key={post.id}>
                <div className="flex items-center justify-between mb-4">
                  <Link href={`/users/${post.username}`} className="text-blue-400 hover:underline">{post.username}</Link>
                  {(isOwner || (isModerator && !post.isModerator) || post.isMe) && (
                    <button onClick={() => deletePost(post.id)} className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-500">Delete</button>
                  )}
                </div>
                <div className="text-white mt-2" dangerouslySetInnerHTML={createMarkup(post.content)} />
              </div>
            ))
          ) : (
            <p></p>
          )}
        </div>
        <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md mb-8">
              <form
                className="space-y-4"
                action={async (formData) => {
                  await handlePost(formData);
                } }
              >
                <textarea className="w-full p-4 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:outline-none bg-gray-950 text-white" type="post" name="post" placeholder="Post" autoComplete="off" rows={3} maxLength={10000} value={postContent} onChange={(e) => setPostContent(e.target.value)} />
                <button className="w-full bg-blue-700 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition-colors duration-300" type="submit">Post</button>
              </form>
            </div></>
      )}
    </div>
    </div>
  );
}
