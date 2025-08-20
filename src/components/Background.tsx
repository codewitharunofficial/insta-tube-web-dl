import { motion } from "framer-motion";
import React from "react";

const AnimatedBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <motion.div
            className="min-h-screen w-full flex items-center justify-center"
            animate={{
                background: [
                    "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
                    "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
                    "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
                    "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)", // loop back
                ],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
            {children}
        </motion.div>
    );
};

export default AnimatedBackground;
