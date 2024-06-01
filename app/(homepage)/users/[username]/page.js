import Link from 'next/link'
import { getSession } from '../../../lib';
import { redirect } from 'next/navigation';
import { ProfileDropdown } from '@/app/components/ProfileDropdown';
import { CheckProfile } from '@/app/components/CheckProfile';
import { Profile } from '@/app/components/Profile';

export const metadata = {
  title: "Profile | CMS",
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
      <Profile />
    </div>
  );
}
