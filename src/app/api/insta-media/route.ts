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

    if (!data || !data.data) {
      return NextResponse.json(
        { error: "Invalid response from Instagram API" },
        { status: 500 }
      );
    }

    const igData = data.data;

    // Normalize response
    let responseMedia: any[] = [];

    // Single video
    if (igData.video_url) {
      responseMedia.push({
        type: "video",
        url: igData.video_url,
        thumbnail: igData.image_versions?.items?.[0]?.url || "",
      });
    }

    // Single image
    if (igData.image_versions?.items?.length) {
      responseMedia.push({
        type: "image",
        url: igData.image_versions.items[0].url,
        thumbnail: igData.image_versions.items[0].url,
      });
    }

    // Carousel (images or videos)
    if (igData.carousel_media?.length) {
      responseMedia = igData.carousel_media
        .map((item: any) => {
          if (item.video_url) {
            return {
              type: "video",
              url: item.video_url,
              thumbnail: item.thumbnail_url || "",
            };
          }
          if (item.image_versions?.items?.length) {
            return {
              type: "image",
              url: item.image_versions.items[0].url,
              thumbnail: item.image_versions.items[0].url,
            };
          }
          return null;
        })
        .filter(Boolean);
    }

    if (!responseMedia.length) {
      return NextResponse.json(
        { error: "No media found in post" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          title: igData.caption?.text || "Instagram Post",
          media: responseMedia,
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
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}
