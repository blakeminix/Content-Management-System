import { NextResponse } from "next/server";
import { getUsername } from "@/app/lib";

export async function POST(req, res) {
  try {
    const username = await getUsername();
    return NextResponse.json({ message: username });
  } catch (error) {
    console.error('Logout failed:', error);
    return NextResponse.json({ message: 'logout failed' });
  }
}
