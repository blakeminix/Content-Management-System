import { joinGroup } from "@/app/lib";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    const { gid } = await req.json();
    await joinGroup(gid);
    return NextResponse.json({ message: 'Group joined successfully' });
  } catch (error) {
    console.error('Join failed:', error);
    return NextResponse.json({ message: 'Group join failed' });
  }
}