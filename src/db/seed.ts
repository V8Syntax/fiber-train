import { db } from "./index";
import { categories } from "./schema";

async function seed() {
  const cats = [
    "Cable preparation",
    "Polishing",
    "Inspection",
    "Defect identification",
    "Rework decisions"
  ];

  for (const cat of cats) {
    await db.insert(categories).values({ name: cat }).onConflictDoNothing();
  }
  console.log("Categories seeded");
}

seed().catch(console.error);
