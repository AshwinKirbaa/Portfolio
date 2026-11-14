import postgres from "postgres";

const connectionString = process.env.DATABASE_URL_POOLED || process.env.POSTGRES_URL || process.env.DATABASE_URL;

const seedProjects = [
  ["safebox", "SAFEBOX AI", "AI SECURITY PLATFORM", "Evidence-driven testing for adversarial AI behavior, policy adherence, sensitive-data exposure, and sandbox isolation.", 2026, "/projects/safebox-ai.html", 1],
  ["twineval", "TWINEVAL AI", "SEMANTIC EVALUATION", "AI-assisted answer evaluation using sentence embeddings and cosine similarity to compare meaning beyond keyword matches.", 2026, "/projects/twineval-ai.html", 2],
  ["camera", "AI SECURITY CAMERA", "COMPUTER VISION", "Real-time visitor identification using OpenCV, InsightFace, facial embeddings, and recognition workflows.", 2026, "/projects/ai-security-camera.html", 3],
  ["gesture", "GESTURE CONTROL", "HUMAN-COMPUTER INTERACTION", "Touchless computer controls built from hand-landmark tracking, gesture recognition, and configurable actions.", 2026, "/projects/gesture-control.html", 4],
  ["dexget", "DEXGET", "WINDOWS DESKTOP ASSISTANT", "A Windows 11 Dynamic Island and local-first assistant for search, controls, automations, clipboard history, and phone transfer.", 2026, "/projects/dexget.html", 5],
];

let initialized = false;

async function initialize(sql) {
  if (initialized) return;
  await sql`CREATE TABLE IF NOT EXISTS portfolio_projects (
    slug TEXT PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL,
    description TEXT NOT NULL, year INTEGER NOT NULL, url TEXT NOT NULL,
    position INTEGER NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
  for (const [slug, name, category, description, year, url, position] of seedProjects) {
    await sql`INSERT INTO portfolio_projects (slug, name, category, description, year, url, position)
      VALUES (${slug}, ${name}, ${category}, ${description}, ${year}, ${url}, ${position})
      ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name, category=EXCLUDED.category,
      description=EXCLUDED.description, year=EXCLUDED.year, url=EXCLUDED.url,
      position=EXCLUDED.position, updated_at=NOW()`;
  }
  initialized = true;
}

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed" });
  }
  if (!connectionString) return response.status(503).json({ error: "Database connection is not configured" });

  const sql = postgres(connectionString, { max: 1, idle_timeout: 5, connect_timeout: 10, ssl: "require" });
  try {
    await initialize(sql);
    const projects = await sql`SELECT slug, name, category, description, year, url, position FROM portfolio_projects ORDER BY position ASC`;
    response.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return response.status(200).json({ projects, count: projects.length, backend: "Node.js Vercel Function", database: "PostgreSQL" });
  } catch (error) {
    console.error("portfolio_projects query failed", error);
    return response.status(500).json({ error: "Unable to load project data" });
  } finally {
    await sql.end({ timeout: 2 });
  }
}
