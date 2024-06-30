import { NextResponse } from "next/server";
import { getProfileGroups } from "@/app/lib";

export async function POST(req) {
  try {
    const { user } = await req.json();
    const groups = await getProfileGroups(user);
    return NextResponse.json({ groups });
  } catch (error) {
    console.error('Get groups failed:', error);
    return NextResponse.json({ message: 'Get groups failed' });
  }
}
