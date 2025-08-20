import React, { useState } from "react";
import { motion } from "framer-motion";
import { YouTubeData } from "./Main";

const YoutubeCard = ({ media }: { media: YouTubeData }) => {
    const [downloading, setDownloading] = useState<string | null>(null);

    const handleDownload = async (url: string, type: "video" | "audio") => {
        try {
            setDownloading(url); // mark this button as downloading
            const response = await fetch(
                `/api/${type === "video" ? "download/youtube-video" : "download/youtube-audio"}`,
                { method: "POST", body: JSON.stringify({ url }) }
            );

            const blob = await response.blob();
            const downloadableUrl = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = downloadableUrl;
            link.download = `youtube.${type === "video" ? "mp4" : "mp3"}`;
            document.body.appendChild(link);
            link.click();

            // cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadableUrl);
        } catch (error) {
            console.error(error);
        } finally {
            setDownloading(null); // reset
        }
    };

    return (
        <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">
                Best Quality Downloads
            </h3>

            <div className="flex flex-col items-center gap-8">
                {/* Best Video */}
                {media.bestVideo && (
                    <div className="w-full flex flex-col items-center">
                        <video
                            src={media.bestVideo.url}
                            controls
                            className="w-full max-h-96 rounded-xl shadow-md mb-3"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={downloading === media.bestVideo.url}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow-lg hover:opacity-90 transition cursor-pointer disabled:opacity-50"
                            onClick={() =>
                                media.bestVideo && handleDownload(media.bestVideo.url, "video")
                            }
                        >
                            {downloading === media.bestVideo.url
                                ? "Downloading..."
                                : `Download Best MP4 (${media.bestVideo.qualityLabel})`}
                        </motion.button>
                    </div>
                )}

                {/* Best Audio */}
                {media.bestAudio && (
                    <div className="w-full flex flex-col items-center">
                        <audio
                            controls
                            src={media.bestAudio.url}
                            className="w-full mb-3"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={downloading === media.bestAudio.url}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold shadow-lg hover:opacity-90 transition cursor-pointer disabled:opacity-50"
                            onClick={() =>
                                media.bestAudio && handleDownload(media.bestAudio.url, "audio")
                            }
                        >
                            {downloading === media.bestAudio.url
                                ? "Downloading..."
                                : "Download Best MP3"}
                        </motion.button>
                    </div>
                )}

                {/* All Videos */}
                {media.video?.length > 0 && (
                    <>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            Other Videos
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 w-full">
                            {media.video.map((v, idx) => (
                                <motion.button
                                    key={idx}
                                    onClick={() => handleDownload(v.url, "video")}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={downloading === v.url}
                                    className={`flex flex-col items-center justify-center px-4 py-3 rounded-xl bg-blue-600 text-white shadow-md hover:bg-blue-700 transition ${downloading === v.url
                                        ? "opacity-50 cursor-progress"
                                        : "cursor-pointer"
                                        }`}
                                >
                                    <span className="font-semibold">
                                        {downloading === v.url
                                            ? "Downloading..."
                                            : v.qualityLabel || "Download"}
                                    </span>
                                    <span className="text-xs opacity-80 mt-1">
                                        {v.mimeType?.split(";")[0] || "video/mp4"}{" "}
                                        {v.size ? `(${v.size})` : ""}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </>
                )}

                {/* All Audios */}
                {media.audio?.length > 0 && (
                    <>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            Other Audios
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            {media.audio.map((a, idx) => (
                                <motion.button
                                    key={idx}
                                    onClick={() => handleDownload(a.url, "audio")}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={downloading === a.url}
                                    className={`flex flex-col items-center justify-center px-4 py-3 rounded-xl bg-green-600 text-white shadow-md hover:bg-green-700 transition ${downloading === a.url
                                        ? "opacity-50 cursor-progress"
                                        : "cursor-pointer"
                                        }`}
                                >
                                    <span className="font-semibold">
                                        {downloading === a.url
                                            ? "Downloading..."
                                            : "MP3"}
                                    </span>
                                    <span className="text-xs opacity-80 mt-1">
                                        {a.mimeType?.split(";")[0] || "audio/mp3"}{" "}
                                        {a.size ? `(${a.size})` : ""}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default YoutubeCard;
