// src/app/page.tsx
'use client';

import { useState, FormEvent } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [www, setWww] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setResult(null);

    let formattedUrl = url;

    if (!/^https?:\/\//i.test(url)) {
      formattedUrl = `https://${url}`;
    }

    if (www && !/^www\./i.test(formattedUrl)) {
      formattedUrl = formattedUrl.replace(/^(https?:\/\/)/i, '$1www.');
    }

    const response = await fetch('/api/intercept', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: formattedUrl }),
    });

    const data = await response.json();

    if (response.ok) {
      setResult(data.file);
    } else {
      setError(data.message);
    }
  };

  return (
    <div>
      <h1>NetworkIntercept</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          required
        />
        <div>
          <label>
            <input
              type="checkbox"
              checked={www}
              onChange={(e) => setWww(e.target.checked)}
            />
            Add "www"
          </label>
        </div>
        <button type="submit">Intercept</button>
      </form>
      {result && (
        <div>
          <h2>Result</h2>
          <a href={result} download>
            Download {result}
          </a>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
