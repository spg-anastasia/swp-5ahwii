// prisma/seed.ts
//import { PrismaClient } from "./prisma/generated/client.ts";
import { PrismaClient } from "./prisma/generated/client.ts";

const prisma = new PrismaClient();

interface OTDBCategory {
  id: number;
  name: string;
}

interface OTDBQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

//Kategorien abrufen aus Open Trivia DB
async function main() {
  console.log("Kategorien abrufen...");
  const catRes = await fetch("https://opentdb.com/api_category.php");
  const catData: { trivia_categories: OTDBCategory[] } = await catRes.json();

 //Kategorien in meine DB einfügen
  for (const cat of catData.trivia_categories) {
    await prisma.category.upsert({
      where: { opentdb_id: cat.id },
      update: {},
      create: {
        name: cat.name,
        opentdb_id: cat.id,
      },
    });
  }

  console.log("Fragen abrufen...");
  
  // 20 Fragen aus Open Trivia DB abrufen
  const questionsRes = await fetch("https://opentdb.com/api.php?amount=20");
  const questionsData: { results: OTDBQuestion[] } = await questionsRes.json();

  //für jede Frage einzeln
  for (const q of questionsData.results) {
   
    //Fragentyp prüfen/erstellen
    const type = await prisma.type.upsert({
      where: { type: q.type },
      update: {},
      create: { type: q.type },
    });

    //Schwierigkeitsgrad prüfen/erstellen
    const difficulty = await prisma.difficulty.upsert({
      where: { level: q.difficulty },
      update: {},
      create: { level: q.difficulty },
    });

   //Kategorie der Frage abrufen
    const category = await prisma.category.findUnique({
      where: { name: q.category },
    });

    if (!category) continue;

 // Korrekte Antwort erstellen
    const correctAnswer = await prisma.answer.create({
      data: { answer: q.correct_answer },
    });

    //Falsche Antworten erstellen
    const incorrectAnswers = [];
    for (const ia of q.incorrect_answers) {
      const ans = await prisma.answer.create({ data: { answer: ia } });
      incorrectAnswers.push(ans);
    }

    //Frage mit allen Eigenschaften (Kategorie, Typ, Schwierigkeit, Antworten) erstellen
    await prisma.question.create({
      data: {
        question: q.question,
        typeId: type.id,
        difficultyId: difficulty.id,
        categoryId: category.id,
        correct_answer_id: correctAnswer.id,
        incorrect_answers: {
          connect: incorrectAnswers.map((ans) => ({ id: ans.id })),
        },
      },
    });
  }

  console.log("Seeding abgeschlossen!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
