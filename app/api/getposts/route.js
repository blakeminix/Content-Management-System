import { NextResponse } from "next/server";
import { getPosts } from "@/app/lib";

export async function POST(req) {
  try {
    const { gid } = await req.json();
    const posts = await getPosts(gid);
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Get posts failed:', error);
    return NextResponse.json({ message: 'Get posts failed' });
  }
}
