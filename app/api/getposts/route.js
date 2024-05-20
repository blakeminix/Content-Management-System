import { NextResponse } from "next/server";
import { getPosts, getUsername } from "@/app/lib";

export async function POST(req, res) {
  try {
    const { gid } = await req.json();
    const posts = await getPosts(gid);
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Logout failed:', error);
    return NextResponse.json({ message: 'logout failed' });
  }
}
