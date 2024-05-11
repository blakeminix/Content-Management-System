import Link from 'next/link'
import "../../globals.css"
import LoggedIn from '../../components/LoggedIn';
import LogOut from '../../components/LogOut';

export const metadata = {
  title: "Dashboard | CMS",
  description: "A content management system developed using React/Next.js for the front-end, Express.js/Node.js for the back-end, and MySQL for the back-end database.",
};
 
export default function Page() {
    
  return (
    <div>
      <LoggedIn />
      <div className="top-bar">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/[username]" as="/blakeminix">Profile</Link>
        <Link href="/settings">Settings</Link>
        <LogOut />
      </div>
      <div className="group-row">
        <Link href="/groups/[id]" as="/groups/1">Group 1</Link>
        <Link href="/groups/[id]" as="/groups/2">Group 2</Link>
        <Link href="/groups/[id]" as="/groups/3">Group 3</Link>
      </div>
    </div>
  );
}
