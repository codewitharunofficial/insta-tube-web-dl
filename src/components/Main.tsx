"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

type MediaFormat = {
    url: string;
    qualityLabel?: string;
    mimeType?: string;
    size?: string;
};

type YouTubeData = {
    title: string;
    thumbnail: string;
    video: MediaFormat[];
    audio: MediaFormat[];
    bestVideo?: MediaFormat;
    bestAudio?: MediaFormat;
};

type InstaData = {
    title: string;
    thumbnail: string;
    media: string; // Instagram returns single video URL
};

const Main = () => {
    const [url, setUrl] = useState("");
    const [media, setMedia] = useState<YouTubeData | InstaData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isYouTube, setIsYouTube] = useState(false);

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMedia(null);

        try {
            let endpoint = "";
            if (url.includes("youtube.com") || url.includes("youtu.be")) {
                endpoint = "/api/youtube-media";
                setIsYouTube(true);
            } else if (url.includes("instagram.com")) {
                endpoint = "/api/insta-media";
                setIsYouTube(false);
            } else {
                setError("Please enter a valid YouTube or Instagram URL");
                setLoading(false);
                return;
            }

            const { data } = await axios.post(endpoint, { url });

            if (data.success) {
                setMedia(data.data);
            } else {
                setError("No media found for this URL");
            }
        } catch (err: any) {
            console.error(err.message);
            setError("Failed to fetch media");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 pt-16 px-4 min-w-screen">
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-600 mb-8 text-center drop-shadow">
                Insta<span className="text-pink-500">Tube</span>
            </h1>

            {/* Input Form */}
            <form
                onSubmit={handleSearch}
                className="w-full max-w-lg flex flex-col sm:flex-row gap-4 bg-white p-6 rounded-xl shadow-lg"
            >
                <input
                    type="text"
                    placeholder="Paste YouTube or Instagram URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition cursor-pointer disabled:opacity-50"
                >
                    {loading ? "Fetching..." : "Fetch"}
                </button>
            </form>

            {/* Error Message */}
            {error && (
                <p className="text-red-500 mt-4 font-medium bg-red-50 px-4 py-2 rounded-lg">
                    {error}
                </p>
            )}

            {/* Media Preview */}
            {media && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mt-10 w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6"
                >
                    <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                        {media.title}
                    </h2>

                    {/* Thumbnail */}
                    <motion.img
                        src={media.thumbnail}
                        alt={media.title}
                        className="w-full rounded-xl shadow-md mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.7 }}
                    />

                    {/* YouTube: Show Video + Audio */}
                    {isYouTube && "video" in media && (
                        <>
                            {/* Best Quality Section */}
                            {(media.bestVideo || media.bestAudio) && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">
                                        Best Quality Downloads
                                    </h3>
                                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                                        {media.bestVideo && (
                                            <motion.a
                                                href={media.bestVideo.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow-lg hover:opacity-90 transition"
                                            >
                                                Download Best MP4 ({media.bestVideo.qualityLabel})
                                            </motion.a>
                                        )}
                                        {media.bestAudio && (
                                            <motion.a
                                                href={media.bestAudio.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold shadow-lg hover:opacity-90 transition"
                                            >
                                                Download Best MP3
                                            </motion.a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* All Video Formats */}
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Other Videos</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                {media.video.map((v, idx) => (
                                    <motion.a
                                        key={idx}
                                        href={v.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex flex-col items-center justify-center px-4 py-3 rounded-xl bg-blue-600 text-white shadow-md hover:bg-blue-700 transition"
                                    >
                                        <span className="font-semibold">
                                            {v.qualityLabel || "Download"}
                                        </span>
                                        <span className="text-xs opacity-80 mt-1">
                                            {v.mimeType?.split(";")[0] || "video/mp4"}{" "}
                                            {v.size ? `(${v.size})` : ""}
                                        </span>
                                    </motion.a>
                                ))}
                            </div>

                            {/* All Audio Formats */}
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Other Audios</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {media.audio.map((a, idx) => (
                                    <motion.a
                                        key={idx}
                                        href={a.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex flex-col items-center justify-center px-4 py-3 rounded-xl bg-green-600 text-white shadow-md hover:bg-green-700 transition"
                                    >
                                        <span className="font-semibold">MP3</span>
                                        <span className="text-xs opacity-80 mt-1">
                                            {a.mimeType?.split(";")[0] || "audio/mp3"}{" "}
                                            {a.size ? `(${a.size})` : ""}
                                        </span>
                                    </motion.a>
                                ))}
                            </div>
                        </>
                    )}


                    {/* Instagram: Only Video */}
                    {!isYouTube && "media" in media && (
                        <div className="grid grid-cols-1 gap-4">
                            <motion.a
                                href={media.media}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex flex-col items-center justify-center px-4 py-3 rounded-xl bg-pink-600 text-white shadow-md hover:bg-pink-700 transition"
                            >
                                <span className="font-semibold">Download MP4</span>
                            </motion.a>
                        </div>
                    )}
                </motion.div>
            )}
        </main>
    );
};

export default Main;
