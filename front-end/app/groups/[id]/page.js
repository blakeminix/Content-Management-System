import Link from 'next/link'

export const metadata = {
  title: "Group | CMS",
  description: "A content management system developed using React/Next.js for the front-end, Express.js/Node.js for the back-end, and MySQL for the back-end database.",
};
 
export default function Page() {
  return (
    <div>
    <Link href="/.">Dashboard</Link>
    <Link href="/settings">Settings</Link>
    <Link href="/[username]" as="/blakeminix">Profile</Link>
    </div>
  );
}
