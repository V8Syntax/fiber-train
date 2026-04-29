import { NextResponse } from "next/server";
import { db } from "@/db";
import { assessments, assessmentQuestions, questions, attempts, attemptAnswers } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, inArray } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "trainer") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { assessmentId, answers } = await request.json();
    
    // Get the assessment to know pass marks and total possible score
    const assessment = await db.query.assessments.findFirst({
      where: eq(assessments.id, assessmentId),
      with: {
        questions: true
      }
    });

    if (!assessment) {
      return NextResponse.json({ message: "Assessment not found" }, { status: 404 });
    }

    const questionIds = assessment.questions.map(q => q.questionId).filter((id): id is number => id !== null);
    const dbQuestions = await db.query.questions.findMany({
      where: inArray(questions.id, questionIds)
    });

    let correctCount = 0;
    const answerRecords = dbQuestions.map(q => {
      const selected = answers[q.id];
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) correctCount++;
      
      return {
        questionId: q.id,
        selectedAnswer: selected || null,
        isCorrect
      };
    });

    const totalQuestions = dbQuestions.length;
    const score = correctCount * 10;
    const percentage = (correctCount / totalQuestions) * 100;
    const result = score >= assessment.passMarks ? 'pass' : 'fail';

    // Insert attempt
    const [attempt] = await db.insert(attempts).values({
      assessmentId,
      trainerId: session.user.id,
      score: score.toString(),
      percentage: percentage.toString(),
      result,
    }).returning();

    // Insert answers
    const finalAnswerRecords = answerRecords.map(a => ({
      ...a,
      attemptId: attempt.id
    }));
    
    await db.insert(attemptAnswers).values(finalAnswerRecords);

    return NextResponse.json({ attemptId: attempt.id });
  } catch (error) {
    console.error("Error submitting assessment:", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
