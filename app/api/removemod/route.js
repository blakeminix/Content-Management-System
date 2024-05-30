import { removeMod } from "@/app/lib";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    const { gid, user } = await req.json();
    await removeMod(gid, user);
    return NextResponse.json({ message: 'Modded successfully' });
  } catch (error) {
    console.error('Mod failed:', error);
    return NextResponse.json({ message: 'Mod failed' });
  }
}