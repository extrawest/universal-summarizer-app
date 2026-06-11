import { Eye, EyeClosed } from "lucide-react";
import { useCallback, useState } from "react";
import { createModel } from "./ai";
import { isYoutubeLink, scrapWebsiteData, scrapYoutubeData } from "./utils";

export default function App() {
  const [apiHidden, setApiHidden] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [summary, setSummary] = useState<Record<string, string> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const summarizer = useCallback(async () => {
    if (!apiKey) {
      alert("Please provide an API key.");
      return;
    }
    setIsLoading(true);
    const llm = createModel(apiKey);
    let text: string;
    let result: Record<string, string>;
    if (isYoutubeLink(link)) {
      text = await scrapYoutubeData(link);
      const structuredLlm = llm.withStructuredOutput({
        name: "video_summary",
        description:
          "Summarizes the video transcription with a header and description",
        schema: {
          type: "object",
          properties: {
            header: {
              type: "string",
              description: "A short, catchy header summarizing the topic",
            },
            description: {
              type: "string",
              description: "A detailed summary of the topic",
            },
          },
          required: ["header", "description"],
        },
      });
      result = await structuredLlm.invoke([
        `Summarize the content of the web page body given below: `,
        text,
      ]);
    } else {
      text = await scrapWebsiteData(link);
      const structuredLlm = llm.withStructuredOutput({
        name: "page_summary",
        description: "Summarizes the page with a header and description",
        schema: {
          type: "object",
          properties: {
            header: {
              type: "string",
              description: "A short, catchy header summarizing the topic",
            },
            description: {
              type: "string",
              description: "A detailed summary of the topic",
            },
          },
          required: ["header", "description"],
        },
      });
      result = await structuredLlm.invoke([
        `Summarize the content of the web page body given below: `,
        text,
      ]);
    }
    setSummary(result);
    setIsLoading(false);
  }, [apiKey, link]);
  return (
    <main className="min-h-screen flex">
      <div className="flex flex-col gap-1 bg-gray-800 px-4 py-12">
        <label>Groq API key</label>
        <div className="flex gap-1 items-center">
          <input
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            type={apiHidden ? "password" : "text"}
            className="input outline-0 w-64"
            placeholder="Input your Groq API key..."
          />
          <div
            className="cursor-pointer"
            onClick={() => setApiHidden((prev) => !prev)}
          >
            {apiHidden ? <Eye /> : <EyeClosed />}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 px-8 py-12">
        <h1 className="text-4xl">
          🦜 Langchain: Summarize text from YT or Website
        </h1>
        <label className="text-xl font-bold">Summarize URL</label>
        <input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          type="text"
          className="input"
          placeholder="Input your link..."
        />
        <button
          className="btn btn-accent w-36"
          onClick={summarizer}
          disabled={isLoading}
        >
          {isLoading ? "Summarizing..." : "Summarize"}
        </button>
        {summary && (
          <div className="bg-green-300/60 p-4 rounded mt-8">
            <h1 className="text-3xl text-black">{summary.header}</h1>
            <p>{summary.description}</p>
          </div>
        )}
      </div>
    </main>
  );
}
