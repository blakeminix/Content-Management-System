import { addDescription } from "@/app/lib";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const message = await req.json();
    const {
      description,
      gid
    } = message;
    await addDescription(description, gid);
    return NextResponse.json({ message: 'Description stored successfully' });
  } catch (error) {
    console.error('Logout failed:', error);
    return NextResponse.json({ message: 'Description store failed' });
  }
}