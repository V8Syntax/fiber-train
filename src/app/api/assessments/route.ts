import { NextResponse } from "next/server";
import { db } from "@/db";
import { assessments, assessmentQuestions } from "@/db/schema";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "supervisor") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, totalMarks, passMarks, status, questionIds } = await request.json();
    
    // Calculate pass marks from percentage if needed, but here we expect a percentage
    // Let's store passMarks as the actual threshold value
    const passThreshold = Math.floor((totalMarks * passMarks) / 100);

    const [assessment] = await db.insert(assessments).values({
      title,
      totalMarks,
      passMarks: passThreshold,
      status,
      createdBy: session.user.id,
    }).returning();

    // Link questions
    const links = questionIds.map((qId: number) => ({
      assessmentId: assessment.id,
      questionId: qId,
    }));

    await db.insert(assessmentQuestions).values(links);

    return NextResponse.json(assessment);
  } catch (error) {
    console.error("Error creating assessment:", error);
    return NextResponse.json({ message: "Failed to create assessment" }, { status: 500 });
  }
}
