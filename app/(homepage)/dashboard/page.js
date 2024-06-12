import Link from 'next/link'
import { getUserGroups, getSession } from '@/app/lib';
import { redirect } from 'next/navigation';
import { ProfileDropdown } from '../../components/ProfileDropdown'

export const metadata = {
  title: "Dashboard | CMS",
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
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups && groups.length > 0 ? (
            groups.map(group => (
              <Link className="block p-6 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition-colors duration-300" key={group.id} href={`/groups/${group.id}`}>
                <div className='text-lg font-semibold text-gray-800 mb-2'>{group.group_name}</div>
                <div className='text-sm text-gray-600'>#{group.id}</div>
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
