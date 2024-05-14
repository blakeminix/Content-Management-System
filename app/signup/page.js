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
        <input type="username" name="username" placeholder="Username" />
        <br />
        <input type="password" name="password" placeholder="Password" />
        <br />
        <input type="password" name="repeatPassword" placeholder="Repeat Password" />
        <br />
        <button type="submit">Sign Up</button>
      </form>

      <form
        action={async (formData) => {
          "use server";
          redirect('/.');
        }}
      >
        <button type="submit">Back to Login</button>
      </form>
      </div>
    </section>
  );
}
