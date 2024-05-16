import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { v4 } from "uuid";

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Use environment variable for secretKey
const secretKey = process.env.SECRET_KEY;
const key = new TextEncoder().encode(secretKey);

const pool = mysql.createPool({
  host: process.env.HOST,
  port: '3307',
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

// Function to hash a password
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Function to verify a password
async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

export async function encrypt(payload) {
  const expiresIn = 30 * 24 * 60 * 60 * 1000;
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
  const name = formData.get("username");
  const password = formData.get("password");

  const [row] = await pool.query('SELECT password FROM users WHERE username = ?', [name]);
  const storedPassword = row[0]?.password;

  let passwordMatch = false;

  if (password != null && storedPassword != null) {
    passwordMatch = await verifyPassword(password, storedPassword);
  }

  if (passwordMatch) {
    const user = { username: name, sid: v4() };

    // Create the session
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const session = await encrypt({ user, expires });

    // Save the session in a cookie
    cookies().set("session", session, { expires, httpOnly: true });
    redirect('/dashboard');
  } else {
    console.log('Incorrect Password');
    redirect('/.');
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
  const name = formData.get("username");
  const password = formData.get("password");
  const repeatPassword = formData.get('repeatPassword');

  const [row] = await pool.query('SELECT username FROM users WHERE username = ?', [name]);
  const storedUsername = row[0]?.username;

  if (storedUsername != name) {
    if (password == repeatPassword && name != null && password != null && repeatPassword != null && name.length >= 3 && password.length >= 5 && name.length && name.length <= 30 && password.length <= 44) {
      const hashedPassword = await hashPassword(password);

      await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [name, hashedPassword]);

      const user = { username: name, sid: v4() };

      // Create the session
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      const session = await encrypt({ user, expires });

      // Save the session in a cookie
      cookies().set("session", session, { expires, httpOnly: true });
      redirect('/dashboard');
    } else {
      console.log('Invalid Password or Username')
      redirect('/signup');
    }
  } else {
    console.log('Username Taken');
    redirect('/signup');
  }
}

export async function createGroup(formData) {
  const session = cookies().get("session")?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  const username = parsed.user.username;

  const group_name = formData.get("group_name");

  const users = `["${username}"]`;
  const is_public = formData.get("is_public");
  let is_request_to_join = false;

  if (is_public == false) {
    is_request_to_join = true;
  }

  const created_at = Date.now();
  const updated_at = Date.now();
  const uniqueid = v4();

  await pool.query('INSERT INTO groups (group_name, users_in_group, moderators, owner_username, is_request_to_join, is_public, created_at, updated_at, uuid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', group_name, users, users, username, is_request_to_join, is_public, created_at, updated_at, uniqueid);

  const [row] = await pool.query('SELECT id FROM users WHERE uuid = ?', [uniqueid]);
  const storedID = row[0]?.id;

  await pool.query('UPDATE users SET groups = JSON_ARRAY_APPEND(groups, "$", ?) WHERE username = ?', [storedID, username]);

  return storedID;
}

export async function deleteAccount() {
  const session = cookies().get("session")?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  const username = parsed.user.username;

  await pool.query('DELETE FROM users WHERE username = ?', [username]);

  cookies().set("session", "", { expires: new Date(0) });
}

export async function getUsername() {
  const session = cookies().get("session")?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  const username = parsed.user.username;
  return username;
}

export async function updateSession(request) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}
