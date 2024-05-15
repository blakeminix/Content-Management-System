import Link from 'next/link'
import { logout, getSession } from '../../../../lib';
import { redirect } from 'next/navigation';
import { ProfileDropdown } from '@/app/components/ProfileDropdown';

export const metadata = {
  title: "Group Settings | CMS",
  description: "A content management system developed using React/Next.js for the front-end, Express.js/Node.js for the back-end, and MySQL for the back-end database.",
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
  
        <form
        action={async () => {
          "use server";
          await logout();
          redirect("/.");
        }}
        >
        <button className="logout-button" type="submit">Logout</button>
        </form>
        <ProfileDropdown />
      </div>
    </div>
  );
}
