import { NextResponse } from "next/server";
import { getUsername } from "@/app/lib";

export async function POST() {
  try {
    const username = await getUsername();
    return NextResponse.json({ message: username });
  } catch (error) {
    console.error('Get username failed:', error);
    return NextResponse.json({ message: 'Get username failed' });
  }
}
