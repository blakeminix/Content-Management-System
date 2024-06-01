import './/globals.css'
import { redirect } from "next/navigation";
import { getSession, login, logout } from './/lib.js';

export const metadata = {
  title: "Login | CMS",
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
    <section className='centered'>
      <div>
      <form
        action={async (formData) => {
          "use server";
          await login(formData);
        }}
      >
        <input className="text-box" type="username" name="username" placeholder="Username" maxLength={30} autoComplete='off'/>
        <br />
        <br />
        <input className="text-box" type="password" name="password" placeholder="Password" maxLength={44} autoComplete='off'/>
        <br />
        <br />
        <div className='border-line'></div>
        <br />
        <button className="login-button" type="submit">Login</button>
      </form>

      <form
        action={async () => {
          "use server";
          await logout();
          redirect("/signup");
        }}
        >
        <br />
        <button className="login-button" type="submit">Don't have an account? Sign Up</button>
        </form>
      </div>
    </section>
  );
}
