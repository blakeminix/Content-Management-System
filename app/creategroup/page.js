import '../globals.css'
import { redirect } from "next/navigation";
import { getSession, login, logout, signup, createGroup } from '../lib';
import { ProfileDropdown } from '@/app/components/ProfileDropdown';
import Link from 'next/link';

export const metadata = {
  title: "Create Group | CMS",
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
    <section className='centered'>
      <div>
      <form
        action={async (formData) => {
          "use server";
          const id = await createGroup(formData);
          redirect(`/groups/${id}`);
        }}
      >
        <input className="text-box" type="username" name="group_name" placeholder="Group Name" maxLength={30}/>
        <br />
        <br />
        <div>
          <input type="radio" id="public" name="is_public" value="public" defaultChecked />
          <label htmlFor="public">Public</label>
          <br />
          <br />
          <input type="radio" id="request" name="is_public" value="request" />
          <label htmlFor="request">Request to Join</label>
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
