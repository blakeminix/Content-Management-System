import { deleteGroup, logout } from "@/app/lib";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    const { gid } = await req.json();
    await deleteGroup(gid);
    return NextResponse.json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Logout failed:', error);
    return NextResponse.json({ message: 'Group deletion failed' });
  }
}