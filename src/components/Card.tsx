"use client";

import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion"
import axios from 'axios';

interface CardProps {
    item: { url: string; type: string; thumbnail?: string };
    idx: number;
}

export const Card = ({ item, idx }: CardProps) => {

    console.log(item);

    const [image, setImage] = useState<string | undefined>(undefined);

    async function getByassPassedImage(url: string) {
        const { data } = await axios.post(
            `/api/insta-image/${encodeURIComponent(url)}`
        );
        if (data) {
            setImage(data);
        }
    }

    useEffect(() => {
        if (item && item.type === "image") {
            getByassPassedImage(item.url);
        }
    }, [item]);

    return (
        <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex flex-col bg-gray-50 p-4 rounded-xl shadow-md items-center"
        >
            {/* Media Preview */}
            {item.type === "video" ? (
                <video
                    src={item.url}
                    controls
                    className="rounded-xl shadow w-full mb-4"
                />
            ) : item.type === "image" && image ? (
                <img
                    src={image}
                    alt={`carousel-item-${idx + 1}`}
                    className="rounded-xl shadow w-full mb-4"
                />
            ) : null}

            {/* Download Button */}
            <motion.a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-lg bg-pink-600 text-white font-semibold hover:bg-pink-700 transition"
            >
                Download {item.type === "video" ? "Video" : "Image"}
            </motion.a>
        </motion.div>
    )
}
