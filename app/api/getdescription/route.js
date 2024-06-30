import { NextResponse } from "next/server";
import { getDescription } from "@/app/lib";

export async function POST(req) {
  try {
    const { gid } = await req.json();
    const description = await getDescription(gid);
    return NextResponse.json({ description });
  } catch (error) {
    console.error('Get description failed:', error);
    return NextResponse.json({ message: 'Get description failed' });
  }
}
