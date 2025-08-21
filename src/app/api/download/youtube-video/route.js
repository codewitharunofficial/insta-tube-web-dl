import axios from 'axios';
import { PassThrough } from 'stream';

export async function POST(req) {
  const body = await req.json();
  const { url } = body;
  const filename = 'youtube_video';

  try {
    // Decode the URL
    const decodedUrl = decodeURIComponent(url);

    // Get client IP from request headers (Vercel-specific)
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

    console.log(clientIp);

    // Create a PassThrough stream for piping
    const passThrough = new PassThrough();

    // Fetch the video stream with client IP forwarded
    const videoResponse = await axios.get(decodedUrl, {
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://www.youtube.com/',
        'Origin': 'https://www.youtube.com/',
        'Range': 'bytes=0-',
        'X-Forwarded-For': clientIp, // Forward client's IP
      },
      maxRedirects: 5, // Handle potential redirects
      timeout: 30000, // Set a 30-second timeout
    });

    // Pipe the response to PassThrough
    videoResponse.data.pipe(passThrough);

    // Handle stream errors
    videoResponse.data.on('error', (error) => {
      console.error('Stream error:', error);
      passThrough.destroy(error);
    });

    // Set headers for downloading the video
    return new Response(passThrough, {
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
        message: 'Failed to download video',
        error: error.message,
        clientIp: req.headers.get('x-forwarded-for') || 'unknown', // Log client IP for debugging
        response: error.response?.data || 'No response data',
      }),
      { status: error.response?.status || 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}