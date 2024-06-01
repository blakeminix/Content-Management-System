import Link from 'next/link'
import { logout, getSession, deleteGroup } from '../lib'
import { redirect } from 'next/navigation';
import { ProfileDropdown } from '../components/ProfileDropdown';

export const metadata = {
  title: "User Not Found | CMS",
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
    <div className='centered'>
      <div className="top-bar">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/creategroup">Create Group</Link>
        <ProfileDropdown />
      </div>
      <div className='not-found-container'>
        <h1>User Not Found</h1>
        <Link href='/dashboard' className='dashboard-link'>Back to Dashboard</Link>
      </div>
    </div>
  );
}
