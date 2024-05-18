import "../../globals.css"
import Link from 'next/link'
import { deleteAccount, getUserGroups, getSession, logout } from '@/app/lib';
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

  const groups = await getUserGroups();

  return (
    <div>
      <div className="top-bar">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/creategroup">Create Group</Link>
        <ProfileDropdown />
      </div>
      <div className="group-row">
        {groups && groups.length > 0 ? (
          groups.map(group => (
            <Link className="group-link" key={group.id} href={`/groups/${group.id}`}>
                <div>{group.group_name}</div>
                <br />
                <div>#{group.id}</div>
            </Link>
          ))
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
}
