import { chromium } from "@playwright/test";
import { SupadataLoader } from "@supadata/langchain-js";

Bun.serve({
  port: 3001,
  async fetch(req) {
    const urlObj = new URL(req.url);

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (req.method === "OPTIONS") {
      return new Response("OK", { headers: corsHeaders });
    }

    if (urlObj.pathname === "/api/scrape/website" && req.method === "POST") {
      try {
        const body = await req.json();
        const url = body.url;

        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: "domcontentloaded" });
        const pageText = await page.locator("body").innerText();

        await browser.close();

        return new Response(JSON.stringify({ text: pageText }), {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        });
      } catch (error: any) {
        console.error("[Server] Error during scraping:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        });
      }
    }

    if (urlObj.pathname === "/api/scrape/youtube" && req.method === "POST") {
      const body = await req.json();
      const url = body.url;

      const loader = new SupadataLoader({
        apiKey: process.env.SUPADATA_API_KEY!,
        url,
        operation: "transcript",
        text: true,
        mode: "auto",
      });

      const docs = await loader.load();
      const pageText = docs.map((doc) => doc.pageContent).join("\n");
      return new Response(JSON.stringify({ text: pageText }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }
    return new Response("Not Found", {
      status: 404,
      headers: corsHeaders,
    });
  },
});

console.log("Scraping backend running on http://localhost:3001");
