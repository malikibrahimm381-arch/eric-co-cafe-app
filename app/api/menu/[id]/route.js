import { NextResponse } from "next/server";
import { roles } from "@/lib/auth";
import { jsonError, requireRoles } from "@/lib/http";
import { deleteMenuItem, getMenuItem, updateMenuItem } from "@/lib/repository";

export const runtime = "nodejs";

export async function GET(_request, { params }) {
  const { id } = await params;
  const item = await getMenuItem(id);

  if (!item) return jsonError("Menu tidak ditemukan.", 404);
  return NextResponse.json({ item });
}

export async function PUT(request, { params }) {
  const auth = requireRoles(request, [roles.admin, roles.developer]);
  if (auth.response) return auth.response;

  try {
    const { id } = await params;
    const body = await request.json();
    const item = await updateMenuItem(id, body);

    if (!item) return jsonError("Menu tidak ditemukan.", 404);
    return NextResponse.json({ item });
  } catch (error) {
    return jsonError(error.message, 400);
  }
}

export async function DELETE(request, { params }) {
  const auth = requireRoles(request, [roles.admin, roles.developer]);
  if (auth.response) return auth.response;

  const { id } = await params;
  const result = await deleteMenuItem(id);
  return NextResponse.json(result);
}
