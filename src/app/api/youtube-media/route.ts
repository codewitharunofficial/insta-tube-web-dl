import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { url } from "inspector/promises";
import { NextResponse } from "next/server";

function extractYouTubeId(url: string) {
  const regex =
    /(?:youtu\.be\/|youtube\.com\/(?:shorts\/|watch\?v=|embed\/|v\/))([\w-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const body = await req.json();

  if (!body.url) {
    return NextResponse.json({ error: "Missing YouTube URL" }, { status: 400 });
  }

  try {
    const videoId = extractYouTubeId(body.url);
    if (!videoId) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    const options = {
      method: "GET",
      url: process.env.YT_API_URL,
      params: { id: videoId, cgeo: "IN" },
      headers: {
        "x-rapidapi-key": process.env.YOUTUBE_API_KEY!,
        "x-rapidapi-host": "yt-api.p.rapidapi.com",
      },
    };

    const { data } = await axios.request(options);

    if (!data.status || data.status !== "OK") {
      return NextResponse.json(
        { error: "Media not found in response" },
        { status: 404 }
      );
    }

    const formats = data.formats || [];

    const adaptiveFormats = data.adaptiveFormats || [];

    const videoFormats = formats
      .filter((f: any) => f.mimeType?.includes("video"))
      .map((f: any) => ({
        url: f.url,
        qualityLabel: f.qualityLabel,
        mimeType: f.mimeType,
        size: f.size,
      }));

    const audioFormats = adaptiveFormats
      .filter((f: any) => f.mimeType?.includes("audio"))
      .map((f: any) => ({
        url: f.url,
        qualityLabel: f.qualityLabel || "Audio",
        mimeType: f.mimeType,
        size: f.size,
      }));

    const bestVideo = videoFormats.length
      ? videoFormats.reduce(
          (prev: { qualityLabel: string }, curr: { qualityLabel: string }) =>
            parseInt(curr.qualityLabel) > parseInt(prev.qualityLabel)
              ? curr
              : prev
        )
      : null;

    const bestAudio = audioFormats.length ? audioFormats[0] : null;

    return NextResponse.json({
      success: true,
      data: {
        title: data.title || "YouTube Video",
        thumbnail: data.thumbnail[data.thumbnail.length - 1]?.url || "",
        video: videoFormats,
        audio: audioFormats,
        bestVideo,
        bestAudio,
      },
    });
  } catch (err: any) {
    console.error("YouTube fetch error:", err.message);
    return NextResponse.json(
      { error: "Something went wrong", details: err.message },
      { status: 500 }
    );
  }
}
