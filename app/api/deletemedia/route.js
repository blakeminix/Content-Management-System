import { deleteMedia } from "@/app/lib";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { mediaid } = await req.json();
    await deleteMedia(mediaid);
    return NextResponse.json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Media deletion failed:', error);
    return NextResponse.json({ message: 'Media deletion failed' });
  }
}