'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function SideBar() {

    const pathname = usePathname()
    const parts = pathname.split('/');
    const gid = parts[2];

    return (
        <div className='side-bar'>
            <Link href={`/groups/${gid}`}>Home</Link>
            <Link href={`/groups/${gid}/posts`}>Posts</Link>
            <Link href={`/groups/${gid}/media`}>Media</Link>
            <Link href={`/groups/${gid}/users`}>Users</Link>
            <Link href={`/groups/${gid}/settings`}>Settings</Link>
        </div>
    );
};
