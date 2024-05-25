import Link from 'next/link'
import { logout, getSession, deleteGroup } from '../lib'
import { redirect } from 'next/navigation';

export const metadata = {
  title: "Group | CMS",
  description: "A content management system developed using React for the front-end, Next.js as a full-stack framework, and MySQL as the back-end database.",
};
 
export default async function Page() {

  const session = await getSession();

  if (session == null) {
    redirect('/.');
  }

  return (
    <div>
      <a>Group Not Found</a>
    </div>
  );
}
