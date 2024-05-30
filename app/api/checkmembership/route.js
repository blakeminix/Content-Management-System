import { checkMembership } from "@/app/lib";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    const { gid } = await req.json();
    const { isMember, isOwner, isModerator } = await checkMembership(gid);
    return NextResponse.json({ isMember, isOwner, isModerator });
  } catch (error) {
    console.error('Logout failed:', error);
    return NextResponse.json({ message: 'Group check failed' });
  }
}