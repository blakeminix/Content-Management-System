import { NextResponse } from "next/server";
import { getProfileDescription } from "@/app/lib";

export async function POST(req) {
  try {
    const { user } = await req.json();
    let description = await getProfileDescription(user);
    if (!description) {
      description = '';
    }
    return NextResponse.json({ description });
  } catch (error) {
    console.error('Get description failed:', error);
    return NextResponse.json({ message: 'Get description failed' });
  }
}
