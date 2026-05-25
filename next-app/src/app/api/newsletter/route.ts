import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const email = String(payload.email ?? "").trim();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ success: false, message: "Invalid email" }, { status: 400 });
    }
    // Mock save
    return NextResponse.json({ success: true, message: "Subscribed successfully" }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
