import { NextResponse } from "next/server";
import { getSessionFromRequest, roleCanAccess } from "@/lib/auth";

export function jsonError(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function requireRoles(request, allowedRoles) {
  const session = getSessionFromRequest(request);

  if (!session) {
    return {
      response: jsonError("Silakan login terlebih dahulu.", 401),
      session: null
    };
  }

  if (!roleCanAccess(session.role, allowedRoles)) {
    return {
      response: jsonError("Akses ditolak untuk role ini.", 403),
      session
    };
  }

  return { response: null, session };
}
