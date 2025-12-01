import { Hono } from "hono";
import { cors } from "hono/cors";   
import { prisma, questionsDifficultyCategoryAmount } from "./lib/questionservice.ts";

const app = new Hono();

app.use("*", cors({
  origin: "*",
}));

const myquestion = await prisma.question.findFirst({
    where: {
        question:
            "Which figure from Greek mythology traveled to the underworld to return his wife Eurydice to the land of the living?",
    },
    select: {
        question: true,
        difficulty: { select: { level: true } },
        category: { select: { name: true } },
        type: { select: { type: true } },
        correct_answer: { select: { answer: true } },
        incorrect_answers: { select: { answer: true } },
    },
});

app.get("/", (c) => c.text("Hono!"));

app.get("/questions", async (c) => {
    const difficulty = c.req.query("difficulty");
    const category = c.req.query("category");
    if (!difficulty || !category) {
        return c.json({ error: "Missing difficulty or category parameter" }, 400);
    }
    const amount = parseInt(c.req.query("amount") || "1");
    return c.json(await questionsDifficultyCategoryAmount(difficulty, category, amount));
});

Deno.serve({ port: 5000 }, app.fetch);
