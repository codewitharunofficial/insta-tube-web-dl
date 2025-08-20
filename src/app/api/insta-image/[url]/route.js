import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(
  Request,
  { params }
) {
  try {
    const { url } = await params;
    if (!url) {
      return NextResponse.json(
        {
          success: false,
          message: "No URL Found",
        },
        { status: 400 }
      );
    } else {
      const imageBuffer = await axios.get(url, {
        responseType: "arraybuffer",
        timeout: 15000,
      });

      const image_base64 = Buffer.from(imageBuffer.data, "binary").toString(
        "base64"
      );

      return new Response(
        JSON.stringify(
          `data:${imageBuffer.headers["content-type"]};base64,${image_base64}`
        ),
        { status: 200 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
        error,
      },
      { status: 500 }
    );
  }
}
