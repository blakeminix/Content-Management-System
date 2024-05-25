import Link from 'next/link'
import { logout, getSession, deleteGroup } from '../../../lib'
import { redirect } from 'next/navigation';
import { ProfileDropdown } from '@/app/components/ProfileDropdown';
import { headers } from "next/headers";
import { DeleteGroup } from '@/app/components/DeleteGroupButton';
import { SideBar } from '@/app/components/SideBar'
import { Home } from '@/app/components/Home';

export const metadata = {
  title: "Group | CMS",
  description: "A content management system developed using React for the front-end, Next.js as a full-stack framework, and MySQL as the back-end database.",
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
