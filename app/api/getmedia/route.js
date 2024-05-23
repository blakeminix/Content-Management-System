import { NextResponse } from "next/server";
import { getMedia } from "@/app/lib";

export async function POST(req, res) {
  try {
    const { gid } = await req.json();
    const media = await getMedia(gid);

    const formattedMedia = media.map(post => {
        if (post.file_data && post.file_data.type === 'Buffer') {
          post.file_data = Buffer.from(post.file_data.data).toString('base64');
        }
        return post;
      });

    return NextResponse.json({ media: formattedMedia });
  } catch (error) {
    console.error('Get media failed:', error);
    return NextResponse.json({ message: 'Get media failed' });
  }
}
