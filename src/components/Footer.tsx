import React from 'react';

const Footer: React.FC = () => (
    <footer style={{
        padding: '1rem',
        textAlign: 'center',
        background: '#f5f5f5',
        fontSize: '0.95rem'
    }}>
        <span>© 2025 Ravi {"(Arun)"} </span>
        <a
            href="https://github.com/codewitharunofficial"
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginLeft: '0.5rem', color: '#333', textDecoration: 'none' }}
        >
            GitHub Profile
        </a>
    </footer>
);

export default Footer;