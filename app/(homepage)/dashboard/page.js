import Link from 'next/link'
import { getUserGroups, getSession } from '@/app/lib';
import { redirect } from 'next/navigation';
import { ProfileDropdown } from '../../components/ProfileDropdown'
import { Dashboard } from '@/app/components/Dashboard';

export const metadata = {
  title: "Dashboard | CMS",
  description: "A content management system developed using React for the front-end, Next.js as a full-stack framework, and MySQL as the back-end database.",
};
 
 
export default async function Page() {
  const session = await getSession();

  if (session == null) {
    redirect('/.');
  }

  const groups = await getUserGroups();

  return (
    <div className='min-h-screen'>
      <div className="flex items-center h-16 fixed top-0 w-full z-50 p-3 bg-gray-800 text-white shadow-md">
        <div className="flex items-center flex-grow">
          <Link className="px-4 py-2 text-lg font-semibold hover:bg-gray-700 rounded transition-colors duration-300" href="/dashboard">Dashboard</Link>
          <Link className="px-4 py-2 text-lg font-semibold hover:bg-gray-700 rounded transition-colors duration-300" href="/creategroup">Create Group</Link>
          <ProfileDropdown />
        </div>
      </div>
      <Dashboard />
    </div>
  );
}
