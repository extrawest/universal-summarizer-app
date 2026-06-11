# LangChain: Universal Summarizer App - YT or Website Summary

[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)]()
[![Maintainer](https://img.shields.io/static/v1?label=Ilya%20Devder&message=Maintainer&color=red)](mailto:ilya.devder@extrawest.com)
[![Ask Me Anything !](https://img.shields.io/badge/Ask%20me-anything-1abc9c.svg)]()
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
![GitHub release](https://img.shields.io/badge/release-v1.0.0-blue)

An AI-powered summarizer application built with React 19, TypeScript, Vite, and Bun. The app uses LangChain and Groq to enable structured text summarization of YouTube videos and websites, providing high-quality summaries (including dynamic catching headers and detailed descriptions) through serverless backend functions.

1. API Request Example:

```bash
curl -X POST http://localhost:3000/api/scrape/website \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

Output:

```json
{
  "text": "Example Domain This domain is for use in illustrative examples in documents. You may use this domain in literature without prior coordination or asking for permission. More information..."
}
```

## Key Features

- **YouTube Transcript Extraction**: Integrates with Supadata to fetch transcriptions from YouTube video URLs.
- **Cheerio-Powered Website Scraping**: Fetches and cleans target website body contents in real-time, removing scripts, stylesheets, and irrelevant tags.
- **AI-Powered Summarization**: Employs LangChain and Groq API with structured JSON output schemas to generate clean, readable summaries.
- **Vercel Serverless Functions**: Fully integrated serverless backend functions (`/api/scrape/youtube` and `/api/scrape/website`) for zero-ops, scalable deployment.
- **Modern Responsive Design**: Built with Tailwind CSS and DaisyUI, providing a clean and intuitive user experience.

## Tech Stack

- **React 19**
- **Vite 8**: Next-generation frontend tooling.
- **TailwindCSS 4 / DaisyUI 5**: Dynamic utility-first CSS styling and UI components.
- **LangChain**: AI orchestration tool to manage LLM workflows and structured output.
- **Groq Llama**: Provides fast inference models for structured summarization.
- **Cheerio**: Lightweight HTML parsing on the serverless backend.
- **Supadata**: Transcription loader service for YouTube video URLs.

## Running On Local Machine:

1. Set up the following environment variables (e.g. in your `.env` file):
   - `SUPADATA_API_KEY=your_supadata_api_key`
2. Run the command to start the frontend and local serverless endpoints:
   ```bash
   bun run dev
   ```
3. Open the following link in your browser: `http://localhost:3000` (or the port specified by Vercel CLI).

## Contributing

Feel free to open issues or submit pull requests to improve the project. Contributions are welcome!

Developed by [extrawest](https://extrawest.com/). Software development company
