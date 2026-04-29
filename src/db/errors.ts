import { NextResponse } from "next/server";

export function isDatabaseConnectionError(error: unknown) {
  const maybeError = error as {
    code?: string;
    cause?: { code?: string };
  };

  const code = maybeError.cause?.code ?? maybeError.code;
  return code === "28P01" || code === "3D000" || code === "ECONNREFUSED";
}

export function databaseConnectionResponse() {
  return NextResponse.json(
    {
      message:
        "Database connection failed. Check DATABASE_URL in .env.local and make sure PostgreSQL is running.",
    },
    { status: 503 }
  );
}
