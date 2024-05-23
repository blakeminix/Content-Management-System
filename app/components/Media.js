'use client';

import { useEffect, useState, useRef } from "react";
import '../globals.css'
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function Media() {
  const router = useRouter();
  const pathname = usePathname();
  const [media, setMedia] = useState([]);
  const [mediaContent, setMediaContent] = useState("");
  const postListRef = useRef(null);

  useEffect(() => {
    fetchMedia();
  }, [pathname]);

  useEffect(() => {
    if (postListRef.current) {
      postListRef.current.scrollTop = postListRef.current.scrollHeight;
    }
  }, [media]);

  const fetchMedia = async () => {
    const parts = pathname.split("/");
    const gid = parts[2];
    try {
      const response = await fetch('http://localhost:3000/api/getmedia', {
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
          post.file_data = Buffer.from(post.file_data.data).toString('base64');
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
      const fileData = e.target.result.split(',')[1];
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

      console.log(typeof fileData);

      try {
        const response = await fetch('http://localhost:3000/api/mediaupload', {
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
      } catch (error) {
        console.error('Media upload failed:', error);
      }
      router.refresh();
    };

    reader.readAsDataURL(file);
  };

  const deleteMedia = async (media) => {
    try {
      const response = await fetch('http://localhost:3000/api/deletemedia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ media }),
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }
      fetchMedia();
    } catch (error) {
      console.error('Logout failed:', error);
    }
    router.refresh();
  }

  return (
    <div className="post-container">
      <div ref={postListRef} className='post-list'>
        {media && media.length > 0 ? (
          media.map(post => (
            <div className="post" key={post.id}>
              <Link href={`/users/${post.username}`} className="post-username">{post.username}</Link>
              <div className="post-username">{post.created_at}</div>
              {post.mime_type.startsWith('image/') ? (
                <img src={`data:${post.mime_type};base64,${post.file_data}`} alt={post.filename} />
              ) : post.mime_type.startsWith('video/') ? (
                <video controls>
                  <source src={`data:${post.mime_type};base64,${post.file_data}`} type={post.mime_type} />
                  Your browser does not support the video tag.
                </video>
              ) : null}
              <br />
              <button onClick={() => deleteMedia(post.id)} className="delete-button">Delete</button>
            </div>
          ))
        ) : (
          <p>No media available</p>
        )}
      </div>
        <form
        onSubmit={handleMediaUpload}
        >
        <div className="post-box-container">
        <input type="file" id="mediaInput" accept="image/*, video/*" />
        <br />
        <button className="post-button" type="submit">Upload</button>
        </div>
      </form>
    </div>
  );
}