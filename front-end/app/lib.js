import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { v4 } from "uuid";

// use environment variable as secretKey
const secretKey = "secret";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload) {

  const expiresIn = 10 * 1000000000;
  const expirationTime = Date.now() + expiresIn;

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(key);
}

export async function decrypt(input) {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login(formData) {

  // Verify credentials && get the user
  const user = { username: formData.get("username"), sid: v4() };

  // Create the session
  const expires = new Date(Date.now() + 10 * 1000000000);
  const session = await encrypt({ user, expires });

  // Save the session in a cookie
  if (formData.get("username") == "admin" && formData.get("password") == "password") {
    cookies().set("session", session, { expires, httpOnly: true });
    redirect('/dashboard');
  }
}

export async function logout() {
  // Destroy the session
  cookies().set("session", "", { expires: new Date(0) });
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function signup(formData) {

  // Verify credentials && get the user
  const user = { username: formData.get("username") };

  // Create the session
  const expires = new Date(Date.now() + 10 * 1000000000);
  const session = await encrypt({ user, expires });

  // Save the session in a cookie
  cookies().set("session", session, { expires, httpOnly: true });
  //redirect('/dashboard');
}

export async function updateSession(request) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 10 * 1000000000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}
