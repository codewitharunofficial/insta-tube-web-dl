"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Card } from "./Card";
import YoutubeCard from "./YoutubeCard";

type MediaFormat = {
    url: string;
    qualityLabel?: string;
    mimeType?: string;
    size?: string;
};

export type YouTubeData = {
    title: string;
    thumbnail: string;
    video: MediaFormat[];
    audio: MediaFormat[];
    bestVideo?: MediaFormat;
    bestAudio?: MediaFormat;
};

type InstaMediaData = {
    url: string;
    type: "video" | "image";
    thumbnail?: string;
};

type InstaData = {
    title: string;
    media: InstaMediaData[];
};

type ResponseData = YouTubeData | InstaData;

const Main = () => {
    const [url, setUrl] = useState("");
    const [media, setMedia] = useState<ResponseData | null>(null);
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
                if (endpoint.includes("instagram")) {
                    setMedia(data.data as InstaData);
                } else {
                    setMedia(data.data as YouTubeData);
                }
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
        <main className="flex flex-col items-center justify-center min-h-screen bg-rgb(249, 250, 251) px-4 min-w-screen pt-24 pb-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-600 mb-8 text-center drop-shadow">
                Insta<span className="text-pink-500">Tube</span> -{" "}
                <span className="text-blue-600">DL</span>
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

                    {/* YouTube */}
                    {isYouTube && "video" in media && (
                        <>
                            {/* Best Quality Section */}
                            {(media.bestVideo || media.bestAudio) && (
                                <YoutubeCard media={media} />
                            )}

                            {/* All Videos */}
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                Other Videos
                            </h3>
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

                            {/* All Audios */}
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                Other Audios
                            </h3>
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

                    {/* Instagram */}
                    {!isYouTube && "media" in media && (
                        <div className={`${media.media.length > 1 ? "grid" : "flex items-center justify-center"} grid-cols-1 sm:grid-cols-2 gap-6`}>
                            {media.media.map((item, idx) => (
                                <Card key={idx} item={item} idx={idx} />
                            ))}
                        </div>
                    )}
                </motion.div>
            )}
        </main>
    );
};

export default Main;
