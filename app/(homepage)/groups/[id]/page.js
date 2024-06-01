import Link from 'next/link'
import { logout, getSession, deleteGroup } from '../../../lib'
import { redirect } from 'next/navigation';
import { ProfileDropdown } from '@/app/components/ProfileDropdown';
import { headers } from "next/headers";
import { DeleteGroup } from '@/app/components/DeleteGroupButton';
import { SideBar } from '@/app/components/SideBar'
import { Home } from '@/app/components/Home';
import { CheckGroup } from '@/app/components/CheckGroup';

export const metadata = {
  title: "Home | CMS",
  description: "A content management system developed using React for the front-end, Next.js as a full-stack framework, and MySQL as the back-end database.",
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        url: '/images/cms.png',
        href: '/images/cms.png',
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/images/cms.png',
        href: '/images/cms.png',
      },
    ],
  },
};
 
export default async function Page() {

  const session = await getSession();

  if (session == null) {
    redirect('/.');
  }

  return (
    <div>
      <div className="top-bar">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/creategroup">Create Group</Link>
        <ProfileDropdown />
      </div>
      <SideBar />
      <Home />
    </div>
  );
}
