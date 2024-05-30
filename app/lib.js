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
  const connection = await pool.getConnection();
  try {
  const name = formData.get("username");
  const password = formData.get("password");

  const [row] = await connection.query('SELECT password FROM users WHERE username = ?', [name]);
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
  } finally {
    connection.release();
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
  const connection = await pool.getConnection();
  try {
  const name = formData.get("username");
  const password = formData.get("password");
  const repeatPassword = formData.get('repeatPassword');

  const [row] = await connection.query('SELECT username FROM users WHERE username = ?', [name]);
  const storedUsername = row[0]?.username;

  if (storedUsername != name) {
    if (password == repeatPassword && name != null && password != null && repeatPassword != null && name.length >= 3 && password.length >= 5 && name.length && name.length <= 30 && password.length <= 44) {
      const hashedPassword = await hashPassword(password);

      await connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [name, hashedPassword]);

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
} finally {
  connection.release();
}
}

export async function addDescription(description, gid) {
  const connection = await pool.getConnection();
  try {
  await connection.query('DELETE FROM description WHERE group_id = ?', [gid]);

  await connection.query('INSERT INTO description (group_id, text) VALUES (?, ?)', [gid, description]);
  } finally {
    connection.release();
  }
}

export async function getDescription(gid) {
  const connection = await pool.getConnection();
  try {
  const description = await connection.query('SELECT text FROM description WHERE group_id = ?', [gid]);

  return description;
  } finally {
    connection.release();
  }
}

export async function checkGroup(gid) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM `groups` WHERE id = ?', [gid]);

    if (rows.length === 0) {
      return false;
    } else {
      return true;
    }
  } catch (err) {
    console.error('Error checking group:', err);
    throw err;
  } finally {
    connection.release();
  }
}

export async function checkMembership(gid) {
  const connection = await pool.getConnection();
  try {
  const session = cookies().get("session")?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  const username = parsed.user.username;

  const [usersRow] = await connection.query('SELECT users_in_group FROM `groups` WHERE id = ?', [gid]);

  const [owner] = await connection.query('SELECT owner_username FROM `groups` WHERE id = ?', [gid]);
  let isOwner = false;

  if (username == owner[0].owner_username) {
    isOwner = true;
  }

  const [mods] = await connection.query('SELECT moderators FROM `groups` WHERE id = ?', [gid]);
  const moderators = mods[0].moderators;
  let isModerator = false;

  for (const mod of moderators) {
    if (mod == username) {
      isModerator = true;
    }
  }

  if (usersRow.length === 0) {
    return { isMember: false, isOwner, isModerator };
  }

  for (const usern of usersRow[0].users_in_group) {
    if (username == usern) {
      return { isMember: true, isOwner, isModerator };
    }
  }
  return { isMember: false, isOwner, isModerator };
} finally {
  connection.release();
}
}

export async function checkProfile(user) {
  const connection = await pool.getConnection();
  try {
  const [userRow] = await connection.query('SELECT * FROM users WHERE username = ?', [user]);

  if (userRow.length === 0) {
    return false;
  }
  return true;
} finally {
  connection.release();
}
}

export async function getPrivacy(gid) {
  const connection = await pool.getConnection();
  try {
  const isPriv = await connection.query('SELECT is_request_to_join FROM `groups` WHERE id = ?', [gid]);
  if (isPriv[0][0].is_request_to_join) {
    return true;
  } else {
    return false;
  }
} finally {
  connection.release();
}
}

export async function getIsRequested(gid) {
  const connection = await pool.getConnection();
  try {
  const session = cookies().get("session")?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  const username = parsed.user.username;

  const isReq = await connection.query('SELECT requests FROM `groups` WHERE id = ?', [gid]);

  if (!isReq || !isReq[0] || !isReq[0][0] || !isReq[0][0].requests) {
    return false;
  }

  for (const req of isReq[0][0].requests) {
    if (req == username) {
      return true;
    }
  }
  return false;
} finally {
  connection.release();
}
}

export async function joinGroup(groupID) {
  const connection = await pool.getConnection();
  try {
  const session = cookies().get("session")?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  const username = parsed.user.username;

  const gid = parseInt(groupID, 10);

  const [userRow] = await connection.query('SELECT `groups` FROM users WHERE username = ?', [username]);
  let userGroups = userRow[0]?.groups;

  userGroups.push(gid);
  await connection.query('UPDATE users SET `groups` = ? WHERE username = ?', [JSON.stringify(userGroups), username]);

  const [groupRow] = await connection.query('SELECT users_in_group FROM `groups` WHERE id = ?', [gid]);
  let users = groupRow[0]?.users_in_group;

  if (!users) {
    users = [];
  }

  users.push(username);
  await connection.query('UPDATE `groups` SET users_in_group = ? WHERE id = ?', [JSON.stringify(users), gid]);
} finally {
  connection.release();
}
}

export async function leaveGroup(groupID) {
  const connection = await pool.getConnection();
  try {
  const session = cookies().get("session")?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  const username = parsed.user.username;

  const gid = parseInt(groupID, 10);

  const [userRow] = await connection.query('SELECT `groups` FROM users WHERE username = ?', [username]);
  let userGroups = userRow[0]?.groups || [];

  userGroups = userGroups.filter(group => group !== gid);
  await connection.query('UPDATE users SET `groups` = ? WHERE username = ?', [JSON.stringify(userGroups), username]);

  const [groupRow] = await connection.query('SELECT users_in_group FROM `groups` WHERE id = ?', [gid]);
  let users = groupRow[0]?.users_in_group || [];

  users = users.filter(user => user !== username);
  await connection.query('UPDATE `groups` SET users_in_group = ? WHERE id = ?', [JSON.stringify(users), gid]);
  } finally {
    connection.release();
  }
}

export async function requestToJoin(gid) {
  const connection = await pool.getConnection();
  try {
  const session = cookies().get("session")?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  const username = parsed.user.username;

  const [requestRow] = await connection.query('SELECT requests FROM `groups` WHERE id = ?', [gid]);
  let requests = requestRow[0]?.requests;

  if (!requests) {
    requests = []
  }

  requests.push(username);
  await connection.query('UPDATE `groups` SET requests = ? WHERE id = ?', [JSON.stringify(requests), gid]);
} finally {
  connection.release();
}
}

export async function cancelRequest(gid) {
  const connection = await pool.getConnection();
  try {
  const session = cookies().get("session")?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  const username = parsed.user.username;

  const [requestRow] = await connection.query('SELECT requests FROM `groups` WHERE id = ?', [gid]);
  let requests = requestRow[0]?.requests;

  if (!requests) {
    requests = [];
  }

  requests = requests.filter(user => user !== username);

  await connection.query('UPDATE `groups` SET requests = ? WHERE id = ?', [JSON.stringify(requests), gid]);
} finally {
  connection.release();
}
}

export async function storePost(post, gid) {
  const connection = await pool.getConnection();
  try {
  const session = cookies().get("session")?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  const username = parsed.user.username;

  await connection.query('INSERT INTO posts (username, group_id, content) VALUES (?, ?, ?)', [username, gid, post]);
  } finally {
    connection.release();
  }
}

export async function deletePost(id) {
  const connection = await pool.getConnection();
  try {
  await connection.query('DELETE FROM posts WHERE id = ?', [id]);
  } finally {
    connection.release();
  }
}

export async function getPosts(gid) {
  const connection = await pool.getConnection();
  try {
  const session = cookies().get("session")?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  const username = parsed.user.username;

  const postArray = [];
  const [postsRow] = await connection.query('SELECT * FROM posts WHERE group_id = ?', [gid]);

  const [ownerRow] = await connection.query('SELECT owner_username FROM `groups` WHERE id = ?', [gid]);
  const owner = ownerRow[0].owner_username;

  const [mods] = await connection.query('SELECT moderators FROM `groups` WHERE id = ?', [gid]);
  const moderators = mods[0].moderators;

  for (let post of postsRow) {
    let isOwner = false;
    let isModerator = false;
    let isMe = false;
    if (post.username == owner) {
      isOwner = true;
    }

    for (const mod of moderators) {
      if (post.username == mod) {
        isModerator = true;
      }
    }

    if (post.username == username) {
      isMe = true;
    }

    post = {
      id: post.id,
      group_id: post.group_id,
      content: post.content,
      created_at: post.created_at,
      username: post.username,
      isMe: isMe,
      isModerator: isModerator,
      isOwner: isOwner
    };
    postArray.push(post);
  }
  return postArray;
} finally {
  connection.release();
}
}

export async function mediaUpload(filename, fileData, type, mime_type, file_size, gid) {
  const connection = await pool.getConnection();
  try {
  const session = cookies().get("session")?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  const username = parsed.user.username;

  const base64Image = fileData.split(';base64,').pop();
  const buffer = Buffer.from(base64Image, 'base64');
  
  await connection.query('INSERT INTO media (filename, file_data, type, mime_type, file_size, username, group_id) VALUES (?, ?, ?, ?, ?, ?, ?)', [filename, buffer, type, mime_type, file_size, username, gid]);
  } finally {
    connection.release();
  }
}

export async function deleteMedia(mediaid) {
  const connection = await pool.getConnection();
  try {
  await connection.query('DELETE from media WHERE id = ?', [mediaid]);
  } finally {
    connection.release();
  }
}

export async function getMedia(gid) {
  const connection = await pool.getConnection();
  try {
  const session = cookies().get("session")?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  const username = parsed.user.username;

  const mediaArray = [];
  const [mediaRow] = await connection.query('SELECT * FROM media WHERE group_id = ?', [gid]);

  const [ownerRow] = await connection.query('SELECT owner_username FROM `groups` WHERE id = ?', [gid]);
  const owner = ownerRow[0].owner_username;

  const [mods] = await connection.query('SELECT moderators FROM `groups` WHERE id = ?', [gid]);
  const moderators = mods[0].moderators;

  for (let media of mediaRow) {
    let isOwner = false;
    let isModerator = false;
    let isMe = false;
    if (media.username == owner) {
      isOwner = true;
    }

    for (const mod of moderators) {
      if (media.username == mod) {
        isModerator = true;
      }
    }

    if (media.username == username) {
      isMe = true;
    }

    media = {
      id: media.id,
      filename: media.filename,
      file_data: media.file_data,
      type: media.type,
      mime_type: media.mime_type,
      file_size: media.file_size,
      width: media.width,
      height: media.height,
      duration: media.duration,
      uploaded_at: media.uploaded_at,
      description: media.description,
      username: media.username,
      group_id: media.group_id,
      isMe: isMe,
      isModerator: isModerator,
      isOwner: isOwner
    };
    mediaArray.push(media);
  }

  return mediaArray;
} finally {
  connection.release();
}
}

export async function getUsers(gid) {
  const connection = await pool.getConnection();
  try {
  const session = cookies().get("session")?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  const username = parsed.user.username;

  const userArray = [];
  const [userRow] = await connection.query('SELECT users_in_group FROM `groups` WHERE id = ?', [gid]);
  const users = userRow[0].users_in_group;

  const [ownerRow] = await connection.query('SELECT owner_username FROM `groups` WHERE id = ?', [gid]);
  const owner = ownerRow[0].owner_username;

  const [mods] = await connection.query('SELECT moderators FROM `groups` WHERE id = ?', [gid]);
  const moderators = mods[0].moderators;

  for (const user of users) {
    let isOwner = false;
    let isModerator = false;
    let isMe = false;
    if (user == owner) {
      isOwner = true;
    }

    for (const mod of moderators) {
      if (user == mod) {
        isModerator = true;
      }
    }

    if (user == username) {
      isMe = true;
    }

    const userObject = {
      username: user,
      isMe: isMe,
      isOwner: isOwner,
      isModerator: isModerator
    };
    userArray.push(userObject);
  }

  return userArray;
} finally {
  connection.release();
}
}

export async function getRequests(gid) {
  const connection = await pool.getConnection();
  try {
  const [reqRow] = await connection.query('SELECT requests FROM `groups` WHERE id = ?', [gid]);
  const req = reqRow[0].requests;
  return req;
  } finally {
    connection.release();
  }
}

export async function acceptRequest(groupID, accept, user) {
  const connection = await pool.getConnection();
  try {
  const gid = parseInt(groupID, 10);

  const [reqRow] = await connection.query('SELECT requests FROM `groups` WHERE id = ?', [gid]);
  let requests = reqRow[0].requests;

  const [userRow] = await connection.query('SELECT users_in_group FROM `groups` WHERE id = ?', [gid]);
  let users = userRow[0].users_in_group;

  const [groupRow] = await connection.query('SELECT `groups` FROM users WHERE username = ?', [user]);
  let userGroups = groupRow[0].groups;

  requests = requests.filter(request => request !== user);
  
  if (accept) {
    users.push(user);
    userGroups.push(gid);
  }

  await connection.query('UPDATE `groups` SET requests = ? WHERE id = ?', [JSON.stringify(requests), gid]);
  await connection.query('UPDATE `groups` SET users_in_group = ? WHERE id = ?', [JSON.stringify(users), gid]);
  await connection.query('UPDATE users SET `groups` = ? WHERE username = ?', [JSON.stringify(userGroups), user]);
} finally {
  connection.release();
}
}

export async function handleMod(gid, user) {
  const connection = await pool.getConnection();
  try {
    const [mods] = await connection.query('SELECT moderators FROM `groups` WHERE id = ?', [gid]);
    let moderators = mods[0].moderators;

    if (!moderators) {
      moderators = [];
    }

    moderators.push(user);

    await connection.query('UPDATE `groups` SET moderators = ? WHERE id = ?', [JSON.stringify(moderators), gid]);
  } finally {
    connection.release();
  }
}

export async function removeMod(gid, user) {
  const connection = await pool.getConnection();
  try {
    const [mods] = await connection.query('SELECT moderators FROM `groups` WHERE id = ?', [gid]);
    let moderators = mods[0].moderators;

    if (!moderators) {
      moderators = [];
    }

    moderators = moderators.filter(mod => mod !== user);

    await connection.query('UPDATE `groups` SET moderators = ? WHERE id = ?', [JSON.stringify(moderators), gid]);
  } finally {
    connection.release();
  }
}

export async function kickUser(groupID, user) {
  const connection = await pool.getConnection();
  try {
  const gid = parseInt(groupID, 10);

  const [userRow] = await connection.query('SELECT users_in_group FROM `groups` WHERE id = ?', [gid]);
  let users = userRow[0].users_in_group;

  const [groupRow] = await connection.query('SELECT `groups` FROM users WHERE username = ?', [user]);
  let userGroups = groupRow[0].groups;

  users = users.filter(username => username !== user);
  userGroups = userGroups.filter(group => group !== gid);

  await connection.query('UPDATE `groups` SET users_in_group = ? WHERE id = ?', [JSON.stringify(users), gid]);
  await connection.query('UPDATE users SET `groups` = ? WHERE username = ?', [JSON.stringify(userGroups), user]);
  } finally {
    connection.release();
  }
}

export async function createGroup(formData) {
  const connection = await connection.getConnection();
  try {
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

  await connection.query('INSERT INTO `groups` (group_name, users_in_group, moderators, owner_username, is_request_to_join, is_public, uuid) VALUES (?, ?, ?, ?, ?, ?, ?)', [group_name, JSON.stringify(users), JSON.stringify(users), username, is_request_to_join, is_public, uniqueid]);

  const [row] = await connection.query('SELECT id FROM `groups` WHERE uuid = ?', [uniqueid]);
  const storedID = row[0]?.id;

  const [userRow] = await connection.query('SELECT `groups` FROM users WHERE username = ?', [username]);
  let userGroups = userRow[0]?.groups;

  if (!userGroups) {
    userGroups = [];
  }

  userGroups.push(storedID);
  await connection.query('UPDATE users SET `groups` = ? WHERE username = ?', [JSON.stringify(userGroups), username]);

  return storedID;
} finally {
  connection.release();
}
}

export async function deleteGroup(gid) {
  const connection = await pool.getConnection();
  try {
  const [groupRow] = await connection.query('SELECT JSON_EXTRACT(users_in_group, "$[*]") AS users_in_group FROM `groups` WHERE id = ?', [gid]);
  const usersArray = groupRow[0].users_in_group;

  for (const username of usersArray) {
    const [userRow] = await connection.query('SELECT `groups` FROM users WHERE username = ?', [username]);
    let userGroups = userRow[0].groups;
    let newArray = userGroups.filter(id => id != gid);

    await connection.query('UPDATE users SET `groups` = ? WHERE username = ?', [JSON.stringify(newArray), username]);
  }

  await connection.query('DELETE FROM `groups` WHERE id = ?', [gid]);
} finally {
  connection.release();
}
}

export async function getUserGroups() {
  const connection = await pool.getConnection();
  try {
  const session = cookies().get("session")?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  const username = parsed.user.username;

  let groupsArray = [];

  const [groupRow] = await connection.query('SELECT JSON_EXTRACT(`groups`, "$[*]") AS `groups` FROM users WHERE username = ?', [username])
  const groups = groupRow[0].groups;

  if (!groups) {
    return groupsArray;
  }

  for (const group of groups) {
    const [groupR] = await connection.query('SELECT * FROM `groups` WHERE id = ?', [group]);
    groupsArray.push(groupR[0]);
  }
  return groupsArray;
} finally {
  connection.release();
}
}

export async function deleteAccount() {
  const connection = await pool.getConnection();
  try {
  const session = cookies().get("session")?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  const username = parsed.user.username;

  await connection.query('DELETE FROM users WHERE username = ?', [username]);

  cookies().set("session", "", { expires: new Date(0) });
  } finally {
    connection.release();
  }
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
