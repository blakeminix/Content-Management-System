import { signup } from "@/app/lib";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const message = await req.json();
    const {
      username,
      password,
      repeatPassword
    } = message;
    const response = await signup(username, password, repeatPassword);
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Signup failed:', error);
    return NextResponse.json({ message: 'Signup failed' });
  }
}
