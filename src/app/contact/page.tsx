"use client";
import AnimatedBackground from "@/components/Background";
import React, { useState } from "react";


export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send the form data to your backend
        setSubmitted(true);
    };

    return (
        <AnimatedBackground>

            <div className="sm:min-h-screen flex items-center justify-center bg-transparent px-4 py-12">
                <div className="w-full max-w-lg bg-transparent rounded-xl shadow-lg p-8 mt-8">
                    <h1 className="text-3xl font-bold mb-2 text-gray-800">Contact Us</h1>
                    <p className="mb-6 text-gray-500">We'd love to hear from you! Fill out the form below and we'll get back to you soon.</p>
                    {submitted ? (
                        <div className="text-green-600 text-center font-semibold py-8">
                            Thank you for contacting us!
                        </div>
                    ) : (
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1" htmlFor="name">
                                    Name
                                </label>
                                <input
                                    className="w-full border border-gray-500 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    autoComplete="off"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    className="w-full border border-gray-500 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    autoComplete="off"
                                    placeholder="Your Email"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1" htmlFor="message">
                                    Message
                                </label>
                                <textarea
                                    className="w-full border border-gray-500 rounded-lg px-4 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                    id="message"
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    required
                                    placeholder="Your Message"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
                            >
                                Send Message
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </AnimatedBackground>
    );
}