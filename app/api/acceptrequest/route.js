import { acceptRequest } from "@/app/lib";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const message = await req.json();
    const {
      gid,
      accept,
      user
    } = message;
    await acceptRequest(gid, accept, user);
    return NextResponse.json({ message: 'Request accepted successfully' });
  } catch (error) {
    console.error('Logout failed:', error);
    return NextResponse.json({ message: 'Request failed' });
  }
}