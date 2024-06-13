import Link from 'next/link'
import { logout, getSession, deleteAccount } from '../../lib'
import { redirect } from 'next/navigation';
import { ProfileDropdown } from '@/app/components/ProfileDropdown';

export const metadata = {
  title: "Settings | CMS",
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
    <div className='min-h-screen'>
      <div className="flex items-center h-16 fixed top-0 w-full z-50 p-3 bg-gray-800 text-white shadow-md">
        <div className="flex items-center flex-grow">
          <Link className="px-4 py-2 text-lg font-semibold hover:bg-gray-700 rounded transition-colors duration-300" href="/dashboard">Dashboard</Link>
          <Link className="px-4 py-2 text-lg font-semibold hover:bg-gray-700 rounded transition-colors duration-300" href="/creategroup">Create Group</Link>
          <ProfileDropdown />
        </div>
      </div>

      <main className="flex flex-col items-center pt-24">
      <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md">
        <form
          className="flex flex-col items-center"
          action={async () => {
            "use server";
            await deleteAccount();
            redirect("/.");
          }}
        >
          <button
            className="px-6 py-2 bg-red-800 text-white font-semibold rounded hover:bg-red-700 transition-colors duration-300"
            type="submit"
          >
            Delete Account
          </button>
        </form>
        </div>
      </main>

    </div>
  );
}
