export const isYoutubeLink = (url: string) => {
  const urlCopy = new URL(url);
  return (
    urlCopy.hostname === "youtube.com" || urlCopy.hostname === "www.youtube.com"
  );
};

export const scrapWebsiteData = async (url: string): Promise<string> => {
  const response = await fetch("http://localhost:3001/api/scrape/website", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error(`Scraping failed with status: ${response.status}`);
  }

  const data = await response.json();
  return data.text || "";
};

export const scrapYoutubeData = async (url: string): Promise<string> => {
  const response = await fetch("http://localhost:3001/api/scrape/youtube", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error(`Scraping failed with status: ${response.status}`);
  }

  const data = await response.json();
  return data.text || "";
};
