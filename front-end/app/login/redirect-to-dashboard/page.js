import Link from 'next/link'
import "../../globals.css"
import { redirect } from 'next/navigation';

export const metadata = {
  title: "Dashboard | CMS",
  description: "A content management system developed using React/Next.js for the front-end, Express.js/Node.js for the back-end, and MySQL for the back-end database.",
};
 
export default function Page() {

  redirect('/dashboard');
    
  return (
    <div>
    </div>
  );
}