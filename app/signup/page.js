import { redirect } from "next/navigation";
import { getSession } from '../lib';
import { SignUp } from '../components/SignUp';

export const metadata = {
  title: "Signup | CMS",
  description: "A content management system developed using React for the front-end, Next.js as a full-stack framework, and MySQL as the back-end database.",
};

export default async function Page() {
  const session = await getSession();
  if (session != null) {
    redirect('/dashboard');
  }

  return (
    <SignUp />
  );
}
