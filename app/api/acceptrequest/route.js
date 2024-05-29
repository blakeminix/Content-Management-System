import { acceptRequest } from "@/app/lib";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    const message = await req.json();
    const {
      gid,
      accept,
      user
    } = message;
    await acceptRequest(gid, accept, user);
    return NextResponse.json({ message: 'Post stored successfully' });
  } catch (error) {
    console.error('Logout failed:', error);
    return NextResponse.json({ message: 'Post store failed' });
  }
}