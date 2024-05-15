import "../../globals.css"
import Link from 'next/link'
import { deleteAccount, getSession, logout } from '@/app/lib';
import { redirect } from 'next/navigation';
import { ProfileDropdown } from '../../components/ProfileDropdown'

export const metadata = {
  title: "Dashboard | CMS",
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
        <Link className="dash-link" href="/dashboard">Dashboard</Link>
        <ProfileDropdown />
      </div>
      <div className="group-row">
        <Link href="/groups/[id]" as="/groups/1">Group 1</Link>
        <Link href="/groups/[id]" as="/groups/2">Group 2</Link>
        <Link href="/groups/[id]" as="/groups/3">Group 3</Link>
      </div>
    </div>
  );
}
