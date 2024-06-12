import { redirect } from "next/navigation";
import { getSession, signup } from '../lib';
import { SignUp } from '../components/SignUp';

export const metadata = {
  title: "Signup | CMS",
  description: "A content management system developed using React for the front-end, Next.js as a full-stack framework, and MySQL as the back-end database.",
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        url: '/images/cms.png',
        href: '/images/cms.png',
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/images/cms.png',
        href: '/images/cms.png',
      },
    ],
  },
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
