import { NextResponse } from "next/server";
import { getMedia } from "@/app/lib";

export async function POST(req, res) {
  try {
    const { gid } = await req.json();
    const media = await getMedia(gid);

    return NextResponse.json({ media });
  } catch (error) {
    console.error('Get media failed:', error);
    return NextResponse.json({ message: 'Get media failed' });
  }
}
