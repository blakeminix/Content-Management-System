import { deleteGroup } from "@/app/lib";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { gid } = await req.json();
    await deleteGroup(gid);
    return NextResponse.json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Group deletion failed:', error);
    return NextResponse.json({ message: 'Group deletion failed' });
  }
}