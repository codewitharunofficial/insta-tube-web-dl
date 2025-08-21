import chromium from "@sparticuz/chromium";
import puppeteerCore from "puppeteer-core";
import puppeteer from "puppeteer"; // only for local dev

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) {
      return new Response(JSON.stringify({ error: "Missing url" }), {
        status: 400,
      });
    }

    const browser = await (process.env.NODE_ENV === "production"
      ? puppeteerCore.launch({
          args: chromium.args,
          executablePath: await chromium.executablePath(),
          headless: chromium.headless,
        })
      : puppeteer.launch({
          headless: true,
        }));

    const page = await browser.newPage();

    let finalDownloadUrl: string | null = null;

    page.on("response", async (response) => {
      const reqUrl = response.url();
      if (reqUrl.includes("googlevideo.com/videoplayback")) {
        if (response.status() >= 300 && response.status() < 400) {
          const location = response.headers()["location"];
          if (location) finalDownloadUrl = location;
        } else {
          finalDownloadUrl = reqUrl;
        }
      }
    });

    await page.goto(url, { waitUntil: "networkidle2" });
    await browser.close();

    if (!finalDownloadUrl) {
      return new Response(
        JSON.stringify({ error: "Could not capture video URL" }),
        { status: 500 }
      );
    }

    // fetch the actual file
    const response = await fetch(finalDownloadUrl);
    if (!response.ok || !response.body) {
      throw new Error("Failed to fetch video file");
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename=video.mp4`,
      },
    });
  } catch (error: any) {
    console.error("Download error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
