import { logout } from "@/app/lib";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    await logout();
    return NextResponse.json({ message: 'logout successful' });
  } catch (error) {
    console.error('Logout failed:', error);
    return NextResponse.json({ message: 'logout failed' });
  }
}
