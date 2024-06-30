import { NextResponse } from "next/server";
import { getUsers } from "@/app/lib";

export async function POST(req) {
  try {
    const { gid } = await req.json();
    const users = await getUsers(gid);
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Get users failed:', error);
    return NextResponse.json({ message: 'Get users failed' });
  }
}
