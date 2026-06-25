import { NextResponse } from "next/server";
import { createSessionToken, publicUser, SESSION_COOKIE, verifyPassword } from "@/lib/auth";
import { jsonError } from "@/lib/http";
import { findUserByUsername } from "@/lib/repository";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json();
    const user = await findUserByUsername(body.username);
    const valid = user ? await verifyPassword(body.password, user.passwordHash) : false;

    if (!valid) {
      return jsonError("Username atau password salah.", 401);
    }

    const safeUser = publicUser(user);
    const response = NextResponse.json({ user: safeUser });

    response.cookies.set(SESSION_COOKIE, createSessionToken(user), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8
    });

    return response;
  } catch (error) {
    return jsonError(error.message, 400);
  }
}
