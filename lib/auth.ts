import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in .env.local");
}

const SECRET = new TextEncoder().encode(JWT_SECRET);

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export async function createToken(user: AuthUser): Promise<string> {
  return await new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verifyToken(
  token: string
): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);

    return {
      id: payload.id as string,
      name: payload.name as string,
      email: payload.email as string,
    };
  } catch {
    return null;
  }
}