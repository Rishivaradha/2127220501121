import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5001';

function UrlShortener() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [expiryTime, setExpiryTime] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleShorten = async () => {
    setErrorMsg('');
    setShortenedUrl('');
    setExpiryTime('');
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/shorturls`, { url: originalUrl });
      setShortenedUrl(response.data.shortLink);
      setExpiryTime(response.data.expiry);
    } catch (error) {
      setErrorMsg('Sorry, we could not shorten your URL. Please check the link and try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      padding: 32,
      maxWidth: 480,
      background: '#fff',
      borderRadius: 16,
      boxShadow: '0 4px 24px #0002'
    }}>
      <h1 style={{
        fontSize: 36,
        fontWeight: 800,
        textAlign: 'center',
        marginBottom: 24,
        letterSpacing: '-1px'
      }}>
        HTTP URL Shortener
      </h1>
      <input
        type="text"
        value={originalUrl}
        onChange={e => setOriginalUrl(e.target.value)}
        placeholder="Paste your long URL here..."
        style={{
          width: '100%',
          border: '1px solid #bbb',
          padding: 12,
          borderRadius: 6,
          fontSize: 16,
          marginBottom: 12
        }}
        autoFocus
      />
      <button
        onClick={handleShorten}
        disabled={loading || !originalUrl.trim()}
        style={{
          width: '100%',
          background: loading ? '#93c5fd' : '#2563eb',
          color: '#fff',
          padding: 14,
          border: 'none',
          borderRadius: 6,
          fontWeight: 700,
          fontSize: 18,
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: 20,
          transition: 'background 0.2s'
        }}
      >
        {loading ? 'Shortening...' : 'Shorten'}
      </button>
      {shortenedUrl && (
        <div style={{
          textAlign: 'center',
          fontSize: 20,
          fontWeight: 600,
          marginBottom: 6
        }}>
          Short URL:{' '}
          <a
            href={shortenedUrl}
            style={{ color: '#2563eb', textDecoration: 'underline' }}
            target="_blank"
            rel="noopener noreferrer"
          >
            {shortenedUrl}
          </a>
        </div>
      )}
      {expiryTime && (
        <div style={{
          textAlign: 'center',
          fontSize: 15,
          color: '#666'
        }}>
          Expiry: {new Date(expiryTime).toLocaleString()}
        </div>
      )}
      {errorMsg && (
        <div style={{
          textAlign: 'center',
          color: '#dc2626',
          marginTop: 10,
          fontSize: 16
        }}>
          {errorMsg}
        </div>
      )}
    </div>
  );
}

export default UrlShortener;
