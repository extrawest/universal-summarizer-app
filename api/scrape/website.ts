import type { VercelRequest, VercelResponse } from "@vercel/node";
import * as cheerio from "cheerio";

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

    // Fetch the target URL using a standard HTTP request
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Failed to fetch target website. Status: ${response.status} ${response.statusText}`,
      });
    }

    const html = await response.text();

    // Load HTML into Cheerio
    const $ = cheerio.load(html);

    // Remove tags that do not contain user-facing text
    $("script, style, noscript, iframe, svg, nav, footer").remove();

    // Extract text from body, clean up whitespace
    const pageText = $("body").text().replace(/\s+/g, " ").trim();

    return res.status(200).json({ text: pageText });
  } catch (error: any) {
    console.error("[Server] Error during website scraping:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
