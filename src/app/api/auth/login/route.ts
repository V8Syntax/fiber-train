import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { encrypt } from "@/lib/auth";
import { databaseConnectionResponse, isDatabaseConnectionError } from "@/db/errors";

export async function POST(request: Request) {
  try {
    const { username, password, role } = await request.json();

    const [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.username, username), eq(users.role, role)));

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 401 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (!user.status) {
      return NextResponse.json(
        { message: "Account is deactivated" },
        { status: 403 }
      );
    }

    const expires = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
    const session = await encrypt({ 
      user: { id: user.id, name: user.name, role: user.role, username: user.username }, 
      expires 
    });

    const response = NextResponse.json({ message: "Login successful" });
    response.cookies.set("session", session, { expires, httpOnly: true });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    if (isDatabaseConnectionError(error)) {
      return databaseConnectionResponse();
    }

    return NextResponse.json(
      { message: "An internal error occurred" },
      { status: 500 }
    );
  }
}
