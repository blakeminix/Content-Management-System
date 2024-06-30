import { kickUser } from "@/app/lib";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const message = await req.json();
    const {
      gid,
      user
    } = message;
    await kickUser(gid, user);
    return NextResponse.json({ message: 'Kicked user successfully' });
  } catch (error) {
    console.error('Kick user failed:', error);
    return NextResponse.json({ message: 'Kick user failed' });
  }
}