'use client';

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <html>
      <body style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f1220', color: 'white', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 720 }}>
          <h1 style={{ fontSize: 56, marginBottom: 16 }}>Something went wrong</h1>
          <p>{error?.message || 'Please refresh the page or try again later.'}</p>
        </div>
      </body>
    </html>
  );
}


