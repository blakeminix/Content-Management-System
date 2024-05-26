import Link from 'next/link'
import { logout, getSession, deleteGroup } from '../../../../lib'
import { redirect } from 'next/navigation';
import { ProfileDropdown } from '@/app/components/ProfileDropdown';
import { DeleteGroup } from '@/app/components/DeleteGroupButton';
import { SideBar } from '@/app/components/SideBar';
import { CheckGroup } from '@/app/components/CheckGroup';
import { LeaveGroup } from '@/app/components/LeaveGroup';

export const metadata = {
  title: "Group Settings | CMS",
  description: "A content management system developed using React for the front-end, Next.js as a full-stack framework, and MySQL as the back-end database.",
};
 
export default async function Page() {

  const session = await getSession();

  if (session == null) {
    redirect('/.');
  }

  return (
    <div>
      <CheckGroup />
      <div className="top-bar">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/creategroup">Create Group</Link>
        <ProfileDropdown />
      </div>
      <SideBar />
      <div className='post-container'>
      <LeaveGroup />
      <DeleteGroup />
      </div>
    </div>
  );
}
