import "../../globals.css"
import Link from 'next/link'
import { deleteAccount, getSession, logout } from '@/app/lib';
import { redirect } from 'next/navigation';
import { ProfileDropdown } from '../../components/ProfileDropdown'

export const metadata = {
  title: "Dashboard | CMS",
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
        <Link className="dash-link" href="/dashboard">Dashboard</Link>
        <ProfileDropdown />
      </div>
      <div className="group-row">
      </div>
    </div>
  );
}
