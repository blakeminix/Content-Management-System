import Link from 'next/link'
import { logout, getSession, deleteAccount } from '../../lib'
import { redirect } from 'next/navigation';
import { ProfileDropdown } from '@/app/components/ProfileDropdown';

export const metadata = {
  title: "Settings | CMS",
  description: "A content management system developed using React for the front-end, Next.js as a full-stack framework, and MySQL as the back-end database.",
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

      <form
        action={async () => {
          "use server";
          await deleteAccount();
          redirect("/.");
        }}
        >
          <div className='group-row'>
            <button className="login-button" type="submit">Delete Account</button>
          </div>
        </form>

    </div>
  );
}
