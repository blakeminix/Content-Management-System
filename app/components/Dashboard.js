'use client';

import { useEffect } from "react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from 'next/link'

export function Dashboard() {
    const router = useRouter();
    const pathname = usePathname();
    const [groups, setGroups] = useState([]);
    const [retrieved, setRetrieved] = useState(false);

    useEffect(() => {
        fetchGroups();
    }, [router, pathname]);

    const fetchGroups = async () => {
        try {
          const response = await fetch('/api/getdashboardgroups', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
          if (!response.ok) {
            throw new Error('Get groups failed');
          }
      
          const data = await response.json();
          const groups = data.groups;
          console.log(data);
          setGroups(groups);
        } catch (error) {
          console.error('Get groups failed:', error);
        } finally {
            setRetrieved(true);
        }
    };

    if (!retrieved) {
        return <div className="flex justify-center items-center h-screen"><div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500"></div></div>;
    }

    return (
        <div className='min-h-screen'>
        <div className="pt-20 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {groups && groups.length > 0 ? (
              groups.map(group => (
                <Link className="block p-6 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-300" key={group.id} href={`/groups/${group.id}`}>
                  <div className='text-base lg:text-lg font-semibold text-white mb-2'>{group.group_name}</div>
                  <div className='text-sm text-gray-400'>{group.id}</div>
                </Link>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">No groups available</p>
            )}
          </div>
        </div>
      </div>
    );
}