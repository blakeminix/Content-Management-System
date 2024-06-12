import { redirect } from "next/navigation";
import { getSession } from './/lib.js';
import { Login } from "./components/Login.js";

export const metadata = {
  title: "Login | CMS",
  description: "Login page for the open-sourced content management system built with Next.js, React, MySQL, and Tailwind CSS.",
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
    <Login />
  );
}
