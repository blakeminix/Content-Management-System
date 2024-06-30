import { getIsRequested } from "@/app/lib";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { gid } = await req.json();
    const result = await getIsRequested(gid);
    return NextResponse.json({result});
  } catch (error) {
    console.error('Get requested failed:', error);
    return NextResponse.json({ message: 'Get requested failed' });
  }
}