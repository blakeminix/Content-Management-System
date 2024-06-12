import { NextResponse } from "next/server";
import { getUserGroups } from "@/app/lib";

export async function POST() {
  try {
    const groups = await getUserGroups();
    return NextResponse.json({ groups });
  } catch (error) {
    console.error('Get groups failed:', error);
    return NextResponse.json({ message: 'Get groups failed' });
  }
}
