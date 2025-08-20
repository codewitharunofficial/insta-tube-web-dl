import axios from 'axios';

export async function POST(req) {
  const body = await req.json();
  const { url } = body;
  const filename = "youtube_video";
  try {
    // Decode the URL since it's passed as a URL-encoded string
    const decodedUrl = decodeURIComponent(url);

    // Fetch the video stream from the provided URL
    const videoResponse = await axios.get(decodedUrl, {
      responseType: "stream",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Referer": "https://www.youtube.com/",
        "Origin": "https://www.youtube.com/",
        "Range": "bytes=0-",
      },
    });

    // Set headers for downloading the video
    return new Response(videoResponse.data, {
      headers: {
        'Content-Disposition': `attachment; filename="${filename}.mp4"`,
        'Content-Type': 'video/mp4',
      },
    });
  } catch (error) {
    console.error('Error downloading video:', error);

    return new Response(
      JSON.stringify({
        success: false,
        message: 'Something went wrong',
        error: error.message,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}