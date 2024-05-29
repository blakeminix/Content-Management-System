import { kickUser } from "@/app/lib";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    const message = await req.json();
    const {
      gid,
      user
    } = message;
    await kickUser(gid, user);
    return NextResponse.json({ message: 'Post stored successfully' });
  } catch (error) {
    console.error('Logout failed:', error);
    return NextResponse.json({ message: 'Post store failed' });
  }
}