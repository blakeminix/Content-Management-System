import { deletePost } from "@/app/lib";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { postid } = await req.json();
    await deletePost(postid);
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Post deletion failed:', error);
    return NextResponse.json({ message: 'Post deletion failed' });
  }
}