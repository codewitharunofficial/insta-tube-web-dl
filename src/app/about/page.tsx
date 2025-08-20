"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6 py-16">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-3xl bg-white shadow-xl rounded-2xl p-8 mt-8"
            >
                <h1 className="text-4xl font-extrabold text-blue-600 mb-6">
                    About <span className="text-pink-500">InstaTube</span>
                </h1>
                <p className="text-gray-700 leading-relaxed mb-4">
                    InstaTube is a simple and powerful tool to download videos from{" "}
                    <span className="font-semibold">YouTube</span> and{" "}
                    <span className="font-semibold">Instagram</span>.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                    Whether you want to save educational content, your favorite music, or
                    funny reels, InstaTube helps you fetch videos and audios in a few
                    clicks. We currently support direct MP4 downloads for Instagram and
                    both MP4 + MP3 for YouTube.
                </p>
                <p className="text-gray-700 leading-relaxed">
                    Our mission is to make media downloads effortless while keeping the
                    experience modern, fast, and user-friendly.
                </p>
            </motion.div>
        </main>
    );
}
