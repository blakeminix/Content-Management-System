import Link from 'next/link'
import LoggedIn from '@/app/components/LoggedIn';
import LogOut from '@/app/components/LogOut';

export const metadata = {
  title: "Users | CMS",
  description: "A content management system developed using React/Next.js for the front-end, Express.js/Node.js for the back-end, and MySQL for the back-end database.",
};
 
export default function Page() {
  return (
    <div>
      <LoggedIn />
      <div className="top-bar">
        <Link href="/.">Dashboard</Link>
        <Link href="/[username]" as="/blakeminix">Profile</Link>
        <Link href="/settings">Settings</Link>
        <LogOut />
      </div>
    </div>
  );
}
