import Link from 'next/link'
import { getSession } from '../lib'
import { ProfileDropdown } from '../components/ProfileDropdown';
import { redirect } from 'next/navigation';

export const metadata = {
  title: "Group Not Found | CMS",
  description: "A content management system developed using React for the front-end, Next.js as a full-stack framework, and MySQL as the back-end database.",
};
 
export default async function Page() {
  const session = await getSession();
  if (session == null) {
    redirect('/.');
  }

  return (
    <div className='min-h-screen'>
      <div className="flex items-center h-16 fixed top-0 w-full z-50 p-3 bg-gray-800 text-white shadow-md">
        <div className="flex items-center flex-grow">
          <Link className="px-4 py-2 text-lg font-semibold hover:bg-gray-700 rounded transition-colors duration-300" href="/dashboard">Dashboard</Link>
          <Link className="px-4 py-2 text-lg font-semibold hover:bg-gray-700 rounded transition-colors duration-300" href="/creategroup">Create Group</Link>
          <ProfileDropdown />
        </div>
      </div>

      <main className="flex-grow flex flex-col items-center justify-center pt-28 p-10">
        <div className="bg-gray-800 rounded-lg shadow-md p-8 text-center max-w-lg">
          <h1 className="text-2xl font-bold text-white mb-4">Group Not Found</h1>
          <p className="text-white mb-8">Sorry, we couldn't find the group you're looking for. The group might have been deleted or the URL is incorrect.</p>
          <Link href='/dashboard' className='px-6 py-2 bg-blue-700 text-white font-semibold rounded hover:bg-blue-600 transition-colors duration-300'>Back to Dashboard</Link>
        </div>
      </main>
    </div>
  );
}
