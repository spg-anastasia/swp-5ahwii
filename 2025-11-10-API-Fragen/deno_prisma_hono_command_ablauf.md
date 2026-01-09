# Deno + Prisma + Hono – Setup Commands

> **Ziel:** Deno-Projekt mit Prisma (SQLite), Migration, Seed und Hono REST Endpoints


---

## 1. Projekt initialisieren

```bash
mkdir ordnername
cd orndername
$env:DATABASE_URL="file:./dev.db"
```

```bash
deno init
```

---

## 2. Prisma & Abhängigkeiten vorbereiten

```bash
deno add npm:prisma@6.16.2 npm:@prisma/client@6.16.2 npm:hono@4.10.6 npm:he@1.2.0
```

```bash
deno add jsr:@std/assert@1
```

---

## 3. Prisma initialisieren (SQLite)


prisma ordenr erstellen und schema.prisma datei reingeben


> erzeugt `prisma/schema.prisma`

---

## 4. Prisma Schema bearbeiten

> `prisma/schema.prisma` manuell anpassen (Models, Relations, Enums)

Danach validieren:

```bash
deno task prisma:validate
deno run -A prisma validate
```

---

## 5. Migration ausführen

```bash
deno task prisma:migrate_dev
deno run -A prisma migrate
```

> erzeugt SQLite DB + Migration

---

## 6. Prisma Client generieren

```bash
deno task prisma:generate
deno run -A prisma generate
deno run -A prisma db push
```

---

## 7. Seed ausführen

> `seed.ts` selbst schreiben

```bash
deno task prisma:seed
```

(Optional Debug):

```bash
deno task prisma:debug_seed
```

---

## 8. Prisma Studio (optional)

```bash
deno task prisma:studio
```

---

## 9. Hono REST API starten

> `main.ts` enthält Hono App + REST Endpoints

```bash
deno task dev
```

---

## 10. Typischer Reset (Entwicklung)

```bash
rm -rf prisma/migrations dev.db
```

```bash
deno task prisma:migrate_dev
```

```bash
deno task prisma:seed
```

---

## Ende

> Reihenfolge ist verbindlich. Keine Schritte überspringen.

