import { addProfileDescription } from "@/app/lib";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    const message = await req.json();
    const {
      description,
      user
    } = message;
    await addProfileDescription(description, user);
    return NextResponse.json({ message: 'Description stored successfully' });
  } catch (error) {
    console.error('Logout failed:', error);
    return NextResponse.json({ message: 'Description store failed' });
  }
}