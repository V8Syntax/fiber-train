import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { databaseConnectionResponse, isDatabaseConnectionError } from "@/db/errors";

export async function POST(request: Request) {
  try {
    const { name, username, password } = await request.json();

    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));

    if (existingUser) {
      return NextResponse.json(
        { message: "Username already taken" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      name,
      username,
      password: hashedPassword,
      role: "supervisor", // Public signup only for supervisors
      status: true,
    });

    return NextResponse.json({ message: "Account created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    if (isDatabaseConnectionError(error)) {
      return databaseConnectionResponse();
    }

    return NextResponse.json(
      { message: "An internal error occurred" },
      { status: 500 }
    );
  }
}
