// app/auth/route.ts — Auth API endpoint (login / signup)
import { NextRequest, NextResponse } from "next/server";
import { signup, login } from "./actions";

export async function POST(request: NextRequest) {
  const action = request.nextUrl.searchParams.get("action");

  if (action !== "login" && action !== "signup") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const formData = await request.formData();
  const result = action === "login" ? await login(formData) : await signup(formData);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ redirect: result.redirect ?? "/dashboard" });
}
