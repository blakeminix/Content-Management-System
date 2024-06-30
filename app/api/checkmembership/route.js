import { checkMembership } from "@/app/lib";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { gid } = await req.json();
    const { isMember, isOwner, isModerator } = await checkMembership(gid);
    return NextResponse.json({ isMember, isOwner, isModerator });
  } catch (error) {
    console.error('Membership check failed:', error);
    return NextResponse.json({ message: 'Membership check failed' });
  }
}