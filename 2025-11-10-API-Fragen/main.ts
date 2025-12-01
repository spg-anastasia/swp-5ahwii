import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { prisma, questionsDifficultyCategoryAmount } from "./lib/questionservice.ts";

const app = new Hono();

// --- API ENDPOINTS --- //

// Kategorien abrufen
app.get("/categories", async (c) => {
    const cats = await prisma.category.findMany({
        select: { name: true }
    });
    return c.json(cats);
});

// Fragen abrufen
app.get("/questions", async (c) => {
    const difficulty = c.req.query("difficulty");
    const category = c.req.query("category");
    const amount = parseInt(c.req.query("amount") || "1");

    if (!difficulty || !category) {
        return c.json({ error: "Missing difficulty or category parameter" }, 400);
    }

    const result = await questionsDifficultyCategoryAmount(difficulty, category, amount);
    return c.json(result);
});

// STATIC FILES (nach API!)
app.use("/*", serveStatic({ root: "./public" }));

// Server starten
Deno.serve({ port: 5000 }, app.fetch);
