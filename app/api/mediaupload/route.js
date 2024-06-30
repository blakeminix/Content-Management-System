import { mediaUpload } from "@/app/lib";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const message = await req.json();
    const {
      filename,
      fileData,
      type,
      mime_type,
      file_size,
      gid
    } = message;
    await mediaUpload(filename, fileData, type, mime_type, file_size, gid);
    return NextResponse.json({ message: 'Media uploaded successfully' });
  } catch (error) {
    console.error('Media upload failed:', error);
    return NextResponse.json({ message: 'Media upload failed' });
  }
}