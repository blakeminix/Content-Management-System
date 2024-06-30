import { checkProfile } from "@/app/lib";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { user } = await req.json();
    const {result, isMe} = await checkProfile(user);
    return NextResponse.json({ result, isMe });
  } catch (error) {
    console.error('Profile check failed:', error);
    return NextResponse.json({ message: 'Profile check failed' });
  }
}