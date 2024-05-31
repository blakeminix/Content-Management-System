import { NextResponse } from "next/server";
import { getProfileGroups } from "@/app/lib";

export async function POST(req, res) {
  try {
    const { user } = await req.json();
    const groups = await getProfileGroups(user);
    return NextResponse.json({ groups });
  } catch (error) {
    console.error('Logout failed:', error);
    return NextResponse.json({ message: 'logout failed' });
  }
}
