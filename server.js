const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { nanoid } = require('nanoid');
const loggingMiddleware = require('./loggingMiddleware');
const log = require('./logger');

const app = express();
const PORT = 5001;
const DEFAULT_VALIDITY_MINUTES = 30;

app.use(cors());
app.use(bodyParser.json());
app.use(loggingMiddleware);

const urlDatabase = {};

function isValidShortcode(code) {
    return /^[a-zA-Z0-9]{4,20}$/.test(code);
}

app.post('/shorturls', async (req, res) => {
    const { url, shortcode, validity } = req.body;

    if (!url || typeof url !== 'string') {
        await log("backend", "error", "handler", "Invalid URL received in /shorturls");
        return res.status(400).json({ error: 'Invalid URL' });
    }

    let validityMinutes = DEFAULT_VALIDITY_MINUTES;
    if (validity !== undefined) {
        if (typeof validity !== 'number' || validity <= 0) {
            await log("backend", "error", "handler", "Invalid validity received in /shorturls");
            return res.status(400).json({ error: 'Validity must be a positive integer (minutes)' });
        }
        validityMinutes = validity;
    }

    let code;
    if (shortcode) {
        if (!isValidShortcode(shortcode)) {
            await log("backend", "error", "handler", "Invalid shortcode received in /shorturls");
            return res.status(400).json({ error: 'Invalid shortcode. Must be alphanumeric and 4-20 chars.' });
        }
        if (urlDatabase[shortcode]) {
            await log("backend", "warn", "handler", "Shortcode collision in /shorturls");
            return res.status(409).json({ error: 'Shortcode already exists' });
        }
        code = shortcode;
    } else {
        do {
            code = nanoid(7);
        } while (urlDatabase[code]);
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + validityMinutes * 60 * 1000);
    urlDatabase[code] = { url, expiresAt: expiresAt.toISOString() };

    await log("backend", "info", "handler", `Shortened URL created: ${code}`);

    const shortLink = `http://localhost:${PORT}/${code}`;
    res.status(201).json({
        shortLink,
        expiry: expiresAt.toISOString()
    });
});

app.get('/:code', async (req, res) => {
    const { code } = req.params;
    const entry = urlDatabase[code];
    if (!entry) {
        await log("backend", "warn", "handler", `Shortcode not found: ${code}`);
        return res.status(404).json({ error: 'Shortcode not found' });
    }
    if (Date.now() > new Date(entry.expiresAt).getTime()) {
        delete urlDatabase[code];
        await log("backend", "warn", "handler", `Shortcode expired: ${code}`);
        return res.status(410).json({ error: 'Shortcode expired' });
    }
    await log("backend", "info", "handler", `Redirected to original URL for shortcode: ${code}`);
    res.redirect(entry.url);
});

app.use(async (err, req, res, next) => {
    await log("backend", "fatal", "handler", `Unhandled error: ${err.message}`);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT);