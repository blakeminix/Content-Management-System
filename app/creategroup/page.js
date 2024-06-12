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
      <section className='centered'>
      <div>
      <form
        action={async (formData) => {
          "use server";
          const id = await createGroup(formData);
          redirect(`/groups/${id}`);
        }}
      >
        <input className="text-box" type="username" name="group_name" placeholder="Group Name" maxLength={24} autoComplete='off'/>
        <br />
        <br />
        <div>
          <input type="radio" id="public" name="is_public" value="public" defaultChecked />
          <label htmlFor="public"> Public</label>
          <br />
          <br />
          <input type="radio" id="request" name="is_public" value="request" />
          <label htmlFor="request"> Private</label>
        </div>
        <br />
        <br />
        <button className="login-button" type="submit">Create Group</button>
      </form>
      </div>
      </section>
    </div>
  );
}
