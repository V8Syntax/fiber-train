import { pgTable, serial, text, varchar, timestamp, integer, boolean, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  role: varchar("role", { length: 20 }).notNull(), // 'supervisor' or 'trainer'
  status: boolean("status").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => categories.id),
  questionText: text("question_text").notNull(),
  questionType: varchar("question_type", { length: 50 }).notNull(), // 'mcq' or 'scenario'
  optionA: text("option_a").notNull(),
  optionB: text("option_b").notNull(),
  optionC: text("option_c").notNull(),
  optionD: text("option_d").notNull(),
  correctAnswer: varchar("correct_answer", { length: 1 }).notNull(), // 'A', 'B', 'C', 'D'
  explanation: text("explanation"),
  difficulty: varchar("difficulty", { length: 20 }).notNull(), // 'easy', 'medium', 'hard'
  status: boolean("status").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  totalMarks: integer("total_marks").notNull(),
  passMarks: integer("pass_marks").notNull(),
  createdBy: integer("created_by").references(() => users.id),
  status: boolean("status").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const assessmentQuestions = pgTable("assessment_questions", {
  id: serial("id").primaryKey(),
  assessmentId: integer("assessment_id").references(() => assessments.id),
  questionId: integer("question_id").references(() => questions.id),
});

export const attempts = pgTable("attempts", {
  id: serial("id").primaryKey(),
  assessmentId: integer("assessment_id").references(() => assessments.id),
  trainerId: integer("trainer_id").references(() => users.id),
  score: decimal("score", { precision: 5, scale: 2 }).notNull(),
  percentage: decimal("percentage", { precision: 5, scale: 2 }).notNull(),
  result: varchar("result", { length: 10 }).notNull(), // 'pass' or 'fail'
  submittedAt: timestamp("submitted_at").defaultNow(),
});

export const attemptAnswers = pgTable("attempt_answers", {
  id: serial("id").primaryKey(),
  attemptId: integer("attempt_id").references(() => attempts.id),
  questionId: integer("question_id").references(() => questions.id),
  selectedAnswer: varchar("selected_answer", { length: 1 }),
  isCorrect: boolean("is_correct").notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  attempts: many(attempts),
}));

export const assessmentsRelations = relations(assessments, ({ many }) => ({
  questions: many(assessmentQuestions),
  attempts: many(attempts),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  category: one(categories, {
    fields: [questions.categoryId],
    references: [categories.id],
  }),
  assessmentQuestions: many(assessmentQuestions),
}));

export const attemptsRelations = relations(attempts, ({ one, many }) => ({
  assessment: one(assessments, {
    fields: [attempts.assessmentId],
    references: [assessments.id],
  }),
  trainer: one(users, {
    fields: [attempts.trainerId],
    references: [users.id],
  }),
  answers: many(attemptAnswers),
}));

export const attemptAnswersRelations = relations(attemptAnswers, ({ one }) => ({
  attempt: one(attempts, {
    fields: [attemptAnswers.attemptId],
    references: [attempts.id],
  }),
  question: one(questions, {
    fields: [attemptAnswers.questionId],
    references: [questions.id],
  }),
}));

export const assessmentQuestionsRelations = relations(assessmentQuestions, ({ one }) => ({
  assessment: one(assessments, {
    fields: [assessmentQuestions.assessmentId],
    references: [assessments.id],
  }),
  question: one(questions, {
    fields: [assessmentQuestions.questionId],
    references: [questions.id],
  }),
}));

