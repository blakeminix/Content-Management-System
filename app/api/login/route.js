import { login } from "@/app/lib";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const message = await req.json();
    const {
      username,
      password
    } = message;
    const response = await login(username, password);
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Login failed:', error);
    return NextResponse.json({ message: 'Login failed' });
  }
}
