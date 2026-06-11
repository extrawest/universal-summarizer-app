import type { VercelRequest, VercelResponse } from "@vercel/node";
import { SupadataLoader } from "@supadata/langchain-js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Add CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "Missing url parameter" });
    }

    const loader = new SupadataLoader({
      apiKey: process.env.SUPADATA_API_KEY!,
      url,
      operation: "transcript",
      text: true,
      mode: "auto",
    });

    const docs = await loader.load();
    const pageText = docs.map((doc) => doc.pageContent).join("\n");

    return res.status(200).json({ text: pageText });
  } catch (error: any) {
    console.error("[Server] Error during YouTube scraping:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
