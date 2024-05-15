import { logout } from "@/app/lib";
import { NextResponse } from "next/server";
/*
export async function handler(req, res) {
    if (req.method === 'POST') {
      try {
        await logout();
        res.status(200).json({ message: 'Logout successful' });
      } catch (error) {
        console.error('Logout failed:', error);
        res.status(500).json({ message: 'Logout failed' });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
*/

export async function POST(req, res) {
  try {
    await logout();
    return NextResponse.json({ message: 'logout successful' });
  } catch (error) {
    console.error('Logout failed:', error);
    return NextResponse.json({ message: 'logout failed' });
  }
}