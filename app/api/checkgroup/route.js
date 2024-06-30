import { checkGroup } from "@/app/lib";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { gid } = await req.json();
    const result = await checkGroup(gid);
    return NextResponse.json({result});
  } catch (error) {
    console.error('Group check failed:', error);
    return NextResponse.json({ message: 'Group check failed' });
  }
}