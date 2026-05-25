import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    if (!payload || typeof payload !== "object") {
      return NextResponse.json(
        { success: false, message: "Invalid JSON payload." },
        { status: 400 }
      );
    }

    const fields = {
      fname: String(payload.fname ?? "").trim(),
      lname: String(payload.lname ?? "").trim(),
      email: String(payload.email ?? "").trim(),
      phone: String(payload.phone ?? "").trim(),
      company: String(payload.company ?? "").trim(),
      designation: String(payload.designation ?? "").trim(),
      interest: String(payload.interest ?? "").trim(),
      message: String(payload.message ?? "").trim(),
    };

    const patterns: Record<string, RegExp> = {
      fname: /^[A-Za-z][A-Za-z\s'-]{1,49}$/,
      lname: /^[A-Za-z][A-Za-z\s'-]{1,49}$/,
      email: /^(?=.{6,100}$)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
      phone: /^(?:\+?\d{1,3})?[6-9]\d{9}$/,
      company: /^[A-Za-z0-9][A-Za-z0-9\s&.,'()-]{1,99}$/,
      designation: /^[A-Za-z][A-Za-z\s&.,'()\/-]{1,79}$/,
      interest: /^(delegate|vip|speaking|sponsorship|media|other)$/,
      message: /^[\s\S]{20,1000}$/,
    };

    const messages: Record<string, string> = {
      fname: "First name must be 2-50 characters (letters only).",
      lname: "Last name must be 2-50 characters (letters only).",
      email: "Enter a valid work email address.",
      phone: "Enter a valid phone number (10 digits, optional country code).",
      company: "Company name must be 2-100 characters.",
      designation: "Designation must be 2-80 characters.",
      interest: "Please select a valid interest option.",
      message: "Message must be between 20 and 1000 characters.",
    };

    const errors: Record<string, string> = {};

    for (const [key, value] of Object.entries(fields)) {
      if (value === "") {
        errors[key] = "This field is required.";
        continue;
      }

      const pattern = patterns[key];
      if (pattern && !pattern.test(value)) {
        errors[key] = messages[key];
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { success: false, message: "Validation failed.", errors },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Enquiry submitted successfully." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error occurred." },
      { status: 500 }
    );
  }
}
