import { NextResponse } from "next/server";
import { getRequests } from "@/app/lib";

export async function POST(req) {
  try {
    const { gid } = await req.json();
    const requests = await getRequests(gid);
    return NextResponse.json({ requests });
  } catch (error) {
    console.error('Get requests failed:', error);
    return NextResponse.json({ message: 'Get requests failed' });
  }
}
