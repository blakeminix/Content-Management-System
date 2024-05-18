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

  let users = [];
  users.push(username);

  let is_public = false;
  let is_request_to_join = false;

  if (formData.get("is_public") == "public") {
    is_public = true;
  } else {
    is_request_to_join = true;
  }
  const uniqueid = v4();

  await pool.query('INSERT INTO `groups` (group_name, users_in_group, moderators, owner_username, is_request_to_join, is_public, uuid) VALUES (?, ?, ?, ?, ?, ?, ?)', [group_name, JSON.stringify(users), JSON.stringify(users), username, is_request_to_join, is_public, uniqueid]);

  const [row] = await pool.query('SELECT id FROM `groups` WHERE uuid = ?', [uniqueid]);
  const storedID = row[0]?.id;

  const [userRow] = await pool.query('SELECT `groups` FROM users WHERE username = ?', [username]);
  let userGroups = userRow[0]?.groups;

  if (!userGroups) {
    userGroups = [];
  }

  userGroups.push(storedID);
  await pool.query('UPDATE users SET `groups` = ? WHERE username = ?', [JSON.stringify(userGroups), username]);

  return storedID;
}

export async function deleteGroup(gid) {
  const [groupRow] = await pool.query('SELECT JSON_EXTRACT(users_in_group, "$[*]") AS users_in_group FROM `groups` WHERE id = ?', [gid]);
  const usersArray = groupRow[0].users_in_group;

  for (const username of usersArray) {
    const [userRow] = await pool.query('SELECT `groups` FROM users WHERE username = ?', [username]);
    let userGroups = userRow[0].groups;
    let newArray = userGroups.filter(id => id != gid);

    await pool.query('UPDATE users SET `groups` = ? WHERE username = ?', [JSON.stringify(newArray), username]);
  }

  await pool.query('DELETE FROM `groups` WHERE id = ?', [gid]);
}

export async function getUserGroups() {
  const session = cookies().get("session")?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  const username = parsed.user.username;

  let groupsArray = [];

  const [groupRow] = await pool.query('SELECT JSON_EXTRACT(`groups`, "$[*]") AS `groups` FROM users WHERE username = ?', [username])
  const groups = groupRow[0].groups;

  if (!groups) {
    return groupsArray;
  }

  for (const group of groups) {
    const [groupR] = await pool.query('SELECT * FROM `groups` WHERE id = ?', [group]);
    groupsArray.push(groupR[0]);
  }
  return groupsArray;
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
