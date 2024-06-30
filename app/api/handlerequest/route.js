import { requestToJoin } from "@/app/lib";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { gid } = await req.json();
    const result = await requestToJoin(gid);
    return NextResponse.json({result});
  } catch (error) {
    console.error('Request failed:', error);
    return NextResponse.json({ message: 'Request failed' });
  }
}