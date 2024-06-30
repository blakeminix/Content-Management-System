'use client';

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function Media() {
  const router = useRouter();
  const pathname = usePathname();
  const [media, setMedia] = useState([]);
  const [mediaContent, setMediaContent] = useState("");
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

        await fetchMedia(gid);
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
  }, [media]);

  const fetchMedia = async () => {
    const parts = pathname.split("/");
    const gid = parts[2];
    try {
      const response = await fetch('/api/getmedia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gid }),
      });
  
      if (!response.ok) {
        throw new Error('Get media failed');
      }
  
      const data = await response.json();

      const mediaWithStringData = data.media.map(post => {
        if (post.file_data && typeof post.file_data !== 'string') {
          post.file_data = Buffer.from(post.file_data).toString('base64');
        }
        return post;
      });

      setMedia(mediaWithStringData);
    } catch (error) {
      console.error('Get media failed:', error);
    }
  };

  const handleMediaUpload = async (event) => {
    event.preventDefault();
    const parts = pathname.split("/");
    const gid = parts[2];
    const fileInput = event.target.mediaInput;
    const file = fileInput.files[0];
    
    if (!file) {
      console.error('No file selected');
      return;
    }

    const reader = new FileReader();

    reader.onload = async function (e) {
      const fileData = e.target.result;
      const filename = file.name;
      const type = file.type;
      const mimeType = type.split('/')[0];
      const fileSize = file.size;

      const mediaPayload = {
        filename,
        fileData: fileData,
        type: mimeType,
        mime_type: type,
        file_size: fileSize,
        gid
      };

      console.log(fileData);

      try {
        const response = await fetch('/api/mediaupload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mediaPayload),
        });

        if (!response.ok) {
          throw new Error('Media upload failed');
        }
        fetchMedia();
        setMediaContent("");
        fileInput.value = "";
      } catch (error) {
        console.error('Media upload failed:', error);
      }
      router.refresh();
    };

    reader.readAsDataURL(file);
  };

  const deleteMedia = async (mediaid) => {
    try {
      const response = await fetch('/api/deletemedia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mediaid }),
      });

      if (!response.ok) {
        throw new Error('Delete media failed');
      }
      fetchMedia();
    } catch (error) {
      console.error('Delete media failed:', error);
    }
    router.refresh();
  }

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
          {media && media.length > 0 ? (
            media.map(post => (
              <div className="mb-2 bg-gray-800 p-6 rounded" key={post.id}>
                <div className="flex items-center justify-between mb-4">
                  <Link href={`/users/${post.username}`} className="text-blue-400 hover:underline">{post.username}</Link>
                  {(isOwner || (isModerator && !post.isModerator) || post.isMe) && (
                    <button onClick={() => deleteMedia(post.id)} className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-500">Delete</button>
                  )}
                </div>
                <div className="flex justify-center items-center">
                  {post.mime_type.startsWith('image/') ? (
                    <img className="max-w-full max-h-500 object-contain" src={`data:${post.mime_type};base64,${post.file_data}`} alt={post.filename} />
                  ) : post.mime_type.startsWith('video/') ? (
                    <video className="max-w-full max-h-500" controls>
                      <source src={`data:${post.mime_type};base64,${post.file_data}`} type={post.mime_type} />
                    </video>
                  ) : null}
                </div>
              </div>
            ))
          ) : (
            <p></p>
          )}
        </div>
        <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <form
            className="space-y-4"
            onSubmit={handleMediaUpload}
          >
            <div className="flex items-center space-x-4">
              <input
                className="hidden"
                type="file"
                id="mediaInput"
                accept="image/*, video/*"
                onChange={(e) => setMediaContent(e.target.files[0]?.name || "")}
              />
              <label htmlFor="mediaInput" className="cursor-pointer bg-blue-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300">
                Choose File
              </label>
              <span className="text-white">{mediaContent}</span>
            </div>
            <button className="w-full bg-blue-700 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition-colors duration-300" type="submit">Upload</button>
          </form>
        </div></>
    )}
    </div>
    </div>
  );
}
