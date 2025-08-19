"use client";

import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const links = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact Us", href: "/contact" },
];

const Navbar = () => {
    const [open, setOpen] = useState(false);

    return (
        <nav className="bg-white shadow-md fixed w-full z-10">
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
                <div className="text-2xl font-bold text-blue-600">InstaTube</div>
                <div className="hidden md:flex space-x-8">
                    {links.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-gray-700 hover:text-blue-600 transition"
                        >
                            {link.name}
                        </a>
                    ))}
                </div>
                <button
                    className="md:hidden text-2xl"
                    onClick={() => setOpen(!open)}
                    aria-label="Toggle menu"
                >
                    {open ? <FaTimes /> : <FaBars />}
                </button>
            </div>
            {/* Mobile menu */}
            {open && (
                <div className="md:hidden bg-white px-4 pb-4">
                    {links.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="block py-2 text-gray-700 hover:text-blue-600 transition"
                            onClick={() => setOpen(false)}
                        >

                            {link.name}
                        </a>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;