import './/globals.css'
import { redirect } from "next/navigation";
import { getSession, login, logout } from './/lib.js';

export default async function Page() {
  const session = await getSession();
  if (session != null) {
    redirect('/dashboard');
  }
  // <pre>{JSON.stringify(session, null, 2)}</pre>
  return (
    <section className='centered'>
      <div>
      <form
        action={async (formData) => {
          "use server";
          await login(formData);
        }}
      >
        <input className="text-box" type="username" name="username" placeholder="Username" maxLength={30}/>
        <br />
        <br />
        <input className="text-box" type="password" name="password" placeholder="Password" maxLength={44}/>
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
