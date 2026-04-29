import { db } from "@/db";
import { sql } from "drizzle-orm";
import { databaseConnectionResponse, isDatabaseConnectionError } from "@/db/errors";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.execute(sql`select 1`);
    return Response.json({ ok: true });
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      return databaseConnectionResponse();
    }

    return Response.json({ ok: false }, { status: 500 });
  }
}
