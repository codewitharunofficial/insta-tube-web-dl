import React from 'react'
import { motion } from "framer-motion"
import { YouTubeData } from './Main'

const YoutubeCard = ({ media }: { media: YouTubeData }) => {
    return (
        <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">
                Best Quality Downloads
            </h3>

            <div className="flex flex-col items-center gap-6">
                {/* Video Preview */}
                {media.bestVideo && (
                    <div className="w-full flex flex-col items-center">
                        <video
                            src={media.bestVideo.url}
                            controls
                            className="w-full max-h-96 rounded-xl shadow-md mb-3"
                        />
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
                    </div>
                )}

                {/* Audio Preview */}
                {media.bestAudio && (
                    <div className="w-full flex flex-col items-center">
                        <audio
                            controls
                            src={media.bestAudio.url}
                            className="w-full mb-3"
                        />
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
                    </div>
                )}
            </div>
        </div>

    )
}

export default YoutubeCard