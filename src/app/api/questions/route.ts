import { NextResponse } from "next/server";
import { db } from "@/db";
import { questions } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newQuestion = await db.insert(questions).values({
      categoryId: parseInt(body.categoryId),
      questionText: body.questionText,
      questionType: body.questionType,
      optionA: body.optionA,
      optionB: body.optionB,
      optionC: body.optionC,
      optionD: body.optionD,
      correctAnswer: body.correctAnswer,
      explanation: body.explanation,
      difficulty: body.difficulty,
    }).returning();

    return NextResponse.json(newQuestion[0]);
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json({ message: "Failed to create question" }, { status: 500 });
  }
}
