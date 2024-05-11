'use client';

import { redirect } from 'next/navigation'
import Link from 'next/link'
import "../globals.css"
import { useSelector } from 'react-redux';

/*
export const metadata = {
  title: "Dashboard | CMS",
  description: "A content management system developed using React/Next.js for the front-end, Express.js/Node.js for the back-end, and MySQL for the back-end database.",
};
 */
export default function Page() {

  const username = useSelector((state) => state.authReducer.value.username);
  //redirect('/login')
  return (
    <div>
      <div className="group-row">
        <Link href="/login">Login</Link>
        <Link href="/groups/[id]" as="/groups/1">Group 1</Link>
        <Link href="/groups/[id]" as="/groups/2">Group 2</Link>
        <Link href="/groups/[id]" as="/groups/3">Group 3</Link>
        <h1>Username: {username}</h1>
      </div>
    </div>
  );
}
