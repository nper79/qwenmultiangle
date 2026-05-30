const express = require('express');
const path = require('path');
const fs = require('fs');

// Load .env file if present
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
        const [key, ...rest] = line.trim().split('=');
        if (key && rest.length) process.env[key] = rest.join('=');
    });
}

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from current directory
app.use(express.static(path.join(__dirname)));

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint (useful for Railway)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Expose FAL_API_KEY from env (never logs the key)
app.get('/api/config', (req, res) => {
    res.json({ falApiKey: process.env.FAL_API_KEY || '' });
});

app.listen(PORT, () => {
    console.log(`🚀 Qwen Multi-Angle server running on port ${PORT}`);
    console.log(`   Open http://localhost:${PORT} in your browser`);
});

