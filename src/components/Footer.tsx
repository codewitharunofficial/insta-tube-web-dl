import React from 'react';

const Footer: React.FC = () => (
    <footer className='footer flex flex-row items-center justify-around p-[1rem] text-center bg-[#f5f5f5] text-lg shadow-md z-10'>
        <a href='https://codewitharun-portfolio.vercel.app' target='_blank' rel='noopener noreferrer' className='ml-2 text-[#333] underline underline-offset-4 cursor-pointer hover:text-[#007bff] transition-colors duration-300' >© 2025 Ravi {"(Arun)"} </a>
        <a
            href="https://github.com/codewitharunofficial"
            target="_blank"
            rel="noopener noreferrer"
            className='ml-2 text-[#333] underline underline-offset-4 cursor-pointer hover:text-[#007bff] transition-colors duration-300'
        >
            GitHub Profile
        </a>
    </footer>
);

export default Footer;