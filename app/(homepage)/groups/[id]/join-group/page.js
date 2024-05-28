import Link from 'next/link'
import { logout, getSession, deleteGroup } from '../../../../lib'
import { redirect } from 'next/navigation';
import { CheckGroup } from '@/app/components/CheckGroup';
import { ProfileDropdown } from '@/app/components/ProfileDropdown';
import { JoinGroup } from '@/app/components/JoinGroup';

export const metadata = {
  title: "Join Group | CMS",
  description: "A content management system developed using React for the front-end, Next.js as a full-stack framework, and MySQL as the back-end database.",
};
 
export default async function Page() {

  const session = await getSession();

  if (session == null) {
    redirect('/.');
  }

  return (
    <div className='centered'>
      <CheckGroup />
      <div className="top-bar">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/creategroup">Create Group</Link>
        <ProfileDropdown />
      </div>
      <div className='not-found-container'>
        <h1>Join Group</h1>
        <JoinGroup />
        <Link href='/dashboard' className='dashboard-link'>Back to Dashboard</Link>
      </div>
    </div>
  );
}
