'use client';

import { useEffect, useState } from "react";
import { usePathname } from 'next/navigation';
import { useRouter } from "next/navigation";
import Link from 'next/link';

export function Profile() {
    const pathname = usePathname();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [groups, setGroups] = useState([]);
    const [description, setDescription] = useState("");
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
  
          const data = await groupResponse.json();
          if (!data.result) {
            router.push('/user-not-found');
            return;
          }

          if (data.isMe) {
            setIsMe(true);
          }

          await getProfileGroups(user);
          await getProfileDescription(user);
        } catch (error) {
          console.error('Error checking user:', error);
        } finally {
            setUsername(user);
            setLoading(false);
        }
      };
  
      checkProfile();
    }, [pathname, router]);

    const getProfileGroups = async (user) => {
        try {
          const response = await fetch('/api/getprofilegroups', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user }),
          });
      
          if (!response.ok) {
            throw new Error('Get groups failed');
          }
      
          const data = await response.json();
          const profileGroups = data.groups;
          setGroups(profileGroups);
        } catch (error) {
          console.error('Get groups failed:', error);
        }
    };

    const getProfileDescription = async (user) => {
        try {
          const response = await fetch('/api/getprofiledescription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user }),
          });
      
          if (!response.ok) {
            throw new Error('Get description failed');
          }
      
          const data = await response.json();
          setDescription(data.description[0][0].description);
        } catch (error) {
          console.error('Get description failed:', error);
        }
    };

    const addProfileDescription = async (formData) => {
        const parts = pathname.split("/");
        const user = parts[2];
        const description = formData.get('description');
        try {
            const response = await fetch('/api/addprofiledescription', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ description, user }),
        });

        if (!response.ok) {
            throw new Error('Add description failed');
        }
            getProfileDescription(user);
        } catch (error) {
            console.error('Add description failed:', error);
        }
        router.refresh();
    };

    const createMarkup = (content) => {
        if (content) {
            const formattedContent = content.replace(/\n/g, '<br/>');
            return { __html: formattedContent };
        }
      };

    if (loading) {
        return <div></div>;
    }
    
    return (
        <div>
        <div className="post-container">
        {isMe ? (
          <div>
          <form
            action={async (formData) => {
              await addProfileDescription(formData);
            }}
          >
            <div className="post-box-container">
              <textarea className="description-box" type="post" name="description" placeholder="Description" autoComplete="off" rows={100} maxLength={100000} value={description} onChange={(e) => setDescription(e.target.value)}/>
              <br />
              <button className="post-button" type="submit">Upload Description</button>
            </div>
          </form>
          </div>
        ) :  (
          <div className='post-list'>
            <div className="post" key={description}>
              <div className="post-content" dangerouslySetInnerHTML={createMarkup(description)} />
            </div>
          </div>
        )}
      </div>
      <div className="group-row">
        {groups && groups.length > 0 ? (
          groups.map(group => (
            <Link className="group-link" key={group.id} href={`/groups/${group.id}`}>
                <div>{group.group_name}</div>
                <br />
                <div>#{group.id}</div>
            </Link>
          ))
        ) : (
          <p></p>
        )}
      </div>
      </div>
    );
}