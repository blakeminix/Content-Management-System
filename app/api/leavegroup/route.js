import { leaveGroup } from "@/app/lib";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { gid } = await req.json();
    await leaveGroup(gid);
    return NextResponse.json({ message: 'Group left successfully' });
  } catch (error) {
    console.error('Leave failed:', error);
    return NextResponse.json({ message: 'Group leave failed' });
  }
}