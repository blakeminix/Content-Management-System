import { NextResponse } from "next/server";
import { getUsers } from "@/app/lib";

export async function POST(req, res) {
  try {
    const { gid } = await req.json();
    const users = await getUsers(gid);
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Logout failed:', error);
    return NextResponse.json({ message: 'logout failed' });
  }
}
