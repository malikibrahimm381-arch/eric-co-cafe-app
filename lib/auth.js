import bcrypt from "bcrypt";
import crypto from "node:crypto";

export const SESSION_COOKIE = "cafe_session";

export const roles = {
  cashier: "cashier",
  admin: "admin",
  developer: "developer"
};

export function publicUser(user) {
  if (!user) return null;

  return {
    id: Number(user.id),
    name: user.name,
    username: user.username,
    role: user.role
  };
}

export async function verifyPassword(password, passwordHash) {
  if (!password || !passwordHash) return false;
  return bcrypt.compare(password, passwordHash);
}

function getSecret() {
  return process.env.APP_SECRET || "dev-only-change-this-secret";
}

function base64Url(input) {
  return Buffer.from(input).toString("base64url");
}

function signPayload(payload) {
  return crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
}

export function createSessionToken(user) {
  const session = {
    ...publicUser(user),
    exp: Date.now() + 1000 * 60 * 60 * 8
  };
  const payload = base64Url(JSON.stringify(session));
  const signature = signPayload(payload);

  return `${payload}.${signature}`;
}

export function readSessionToken(token) {
  if (!token || !token.includes(".")) return null;

  const [payload, signature] = token.split(".");
  const expectedSignature = signPayload(payload);

  if (
    signature.length !== expectedSignature.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  ) {
    return null;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!session.exp || session.exp < Date.now()) return null;
    return publicUser(session);
  } catch {
    return null;
  }
}

export function getSessionFromRequest(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return readSessionToken(token);
}

export function roleCanAccess(role, allowedRoles) {
  return Boolean(role && allowedRoles.includes(role));
}
