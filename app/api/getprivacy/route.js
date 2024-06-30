import { getPrivacy } from "@/app/lib";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { gid } = await req.json();
    const result = await getPrivacy(gid);
    return NextResponse.json({result});
  } catch (error) {
    console.error('Get privacy failed:', error);
    return NextResponse.json({ message: 'Get privacy failed' });
  }
}