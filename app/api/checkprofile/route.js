import { checkProfile } from "@/app/lib";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    const { user } = await req.json();
    const result = await checkProfile(user);
    return NextResponse.json({result});
  } catch (error) {
    console.error('Logout failed:', error);
    return NextResponse.json({ message: 'Group check failed' });
  }
}