import { NextResponse } from "next/server";
import { db } from "@/db";
import { assessments } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const assessmentId = parseInt(id);

    const assessment = await db.query.assessments.findFirst({
      where: eq(assessments.id, assessmentId),
      with: {
        questions: {
          with: {
            question: {
              with: {
                category: true
              }
            }
          }
        }
      }
    });

    if (!assessment) {
      return NextResponse.json({ message: "Assessment not found" }, { status: 404 });
    }

    return NextResponse.json(assessment);
  } catch (error) {
    console.error("Error fetching assessment:", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
