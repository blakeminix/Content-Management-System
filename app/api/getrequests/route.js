import { NextResponse } from "next/server";
import { getRequests } from "@/app/lib";

export async function POST(req, res) {
  try {
    const { gid } = await req.json();
    const requests = await getRequests(gid);
    return NextResponse.json({ requests });
  } catch (error) {
    console.error('Logout failed:', error);
    return NextResponse.json({ message: 'logout failed' });
  }
}
