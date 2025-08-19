import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: "Missing Instagram URL" },
        { status: 400 }
      );
    }

    const { data } = await axios.request({
      method: "GET",
      url: "https://instagram-scraper-api2.p.rapidapi.com/v1/post_info",
      params: { code_or_id_or_url: url },
      headers: {
        "x-rapidapi-key": process.env.INSTAGRAM_API_KEY!,
        "x-rapidapi-host": "instagram-scraper-api2.p.rapidapi.com",
      },
    });

    if (!data || !data.data || !data.data.video_url) {
      return NextResponse.json(
        { error: "Media not found in response" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          title: data.data.caption?.text || "Instagram Video",
          thumbnail: data.data.image_versions?.items?.[0]?.url || "",
          media: data.data.video_url,
        },
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*", // 🔒 restrict in prod
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error: any) {
    console.error("Instagram API error:", error.message);
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*", // 🔒 restrict in prod
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}
