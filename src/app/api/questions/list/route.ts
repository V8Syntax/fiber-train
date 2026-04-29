import { NextResponse } from "next/server";
import { db } from "@/db";
import { questions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const allQuestions = await db.query.questions.findMany({
    with: {
      category: true,
    },
    where: eq(questions.status, true),
  });
  return NextResponse.json(allQuestions);
}
