import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { usersTable, sessionsTable } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import crypto from "crypto";

const RegisterBody = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  preferredLanguage: z.string().optional(),
});

function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password + (process.env.SESSION_SECRET ?? "secret")).digest("hex");
}

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RegisterBody.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

    const { name, email, password, preferredLanguage } = parsed.data;
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (existing.length > 0) return NextResponse.json({ error: "User already exists" }, { status: 409 });

    const [user] = await db.insert(usersTable).values({
      name,
      email,
      passwordHash: hashPassword(password),
      preferredLanguage: preferredLanguage ?? "en",
    }).returning();

    const token = generateToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db.insert(sessionsTable).values({ userId: user.id, token, expiresAt });

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, preferredLanguage: user.preferredLanguage, createdAt: user.createdAt.toISOString() },
      token,
    }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
