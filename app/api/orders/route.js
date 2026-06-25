import { NextResponse } from "next/server";
import { getSessionFromRequest, roles } from "@/lib/auth";
import { jsonError, requireRoles } from "@/lib/http";
import { createOrder, getOrders } from "@/lib/repository";

export const runtime = "nodejs";

export async function GET(request) {
  const auth = requireRoles(request, [roles.cashier, roles.admin, roles.developer]);
  if (auth.response) return auth.response;

  const from = request.nextUrl.searchParams.get("from") || "";
  const to = request.nextUrl.searchParams.get("to") || "";
  const orders = await getOrders({ from, to });
  return NextResponse.json({ orders });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const session = getSessionFromRequest(request);
    const order = await createOrder(body, session);
    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    return jsonError(error.message, 400);
  }
}
