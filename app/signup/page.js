import '../globals.css'
import { redirect } from "next/navigation";
import { getSession, login, logout, signup } from '../lib';

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
          await signup(formData);
        }}
      >
        <input className="text-box" type="username" name="username" placeholder="Username" maxLength={30}/>
        <br />
        <br />
        <input className="text-box" type="password" name="password" placeholder="Password" maxLength={44}/>
        <br />
        <br />
        <input className="text-box" type="password" name="repeatPassword" placeholder="Repeat Password" maxLength={44}/>
        <br />
        <br />
        <div className='border-line'></div>
        <br />
        <button className="login-button" type="submit">Sign Up</button>
      </form>

      <form
        action={async (formData) => {
          "use server";
          redirect('/.');
        }}
      >
        <br />
        <button className="login-button" type="submit">Back to Login</button>
      </form>
      </div>
    </section>
  );
}