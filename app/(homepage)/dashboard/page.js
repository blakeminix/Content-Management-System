import "../../globals.css"
import Link from 'next/link'
import { deleteAccount, getSession, logout } from '@/app/lib';
import { redirect } from 'next/navigation';

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
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/[username]" as="/blakeminix">Profile</Link>
        <Link href="/settings">Settings</Link>

        <form
        action={async () => {
          "use server";
          await logout();
          redirect("/login");
        }}
        >
        <button type="submit">Logout</button>
        </form>

        <form
        action={async () => {
          "use server";
          await deleteAccount();
          redirect("/login");
        }}
        >
        <button type="submit">Delete Account</button>
        </form>

      </div>
      <div className="group-row">
        <Link href="/groups/[id]" as="/groups/1">Group 1</Link>
        <Link href="/groups/[id]" as="/groups/2">Group 2</Link>
        <Link href="/groups/[id]" as="/groups/3">Group 3</Link>
      </div>
    </div>
  );
}
