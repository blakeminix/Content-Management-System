import '../globals.css'
import { redirect } from "next/navigation";
import { getSession, login, logout, signup, createGroup } from '../lib';
import { ProfileDropdown } from '@/app/components/ProfileDropdown';
import Link from 'next/link';

export const metadata = {
  title: "Create Group | CMS",
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

      <main className="py-24">
        <div className="container mx-auto px-4">
          <section className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-md p-10">
            <h1 className="text-2xl font-bold mb-6 text-center text-white">Create Group</h1>
            <form
              action={async (formData) => {
              "use server";
              const id = await createGroup(formData);
              redirect(`/groups/${id}`);
            }}>
              <div className="mb-4">
                <input
                  type="text"
                  name="group_name"
                  className="p-4 w-full border rounded-lg mb-6 text-white bg-gray-950"
                  placeholder="Group Name"
                  maxLength={24}
                  autoComplete="off"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-sm font-bold text-white">Group Type:</label>
                <div>
                  <input
                    type="radio"
                    id="public"
                    name="is_public"
                    value="public"
                    defaultChecked
                    className="mr-2"
                  />
                  <label htmlFor="public" className="mr-6 text-white">Public</label>

                  <input
                    type="radio"
                    id="request"
                    name="is_public"
                    value="request"
                    className="mr-2"
                  />
                  <label htmlFor="request" className='text-white'>Private</label>
                </div>
              </div>

              <button
                type="submit"
                className="bg-blue-700 w-full text-white rounded-lg py-3 px-6 hover:bg-blue-600 transition-colors duration-300"
              >
                Create Group
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
