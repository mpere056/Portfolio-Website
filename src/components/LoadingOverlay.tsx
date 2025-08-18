import React from 'react';

interface LoadingOverlayProps {
  label?: string;
}

export default function LoadingOverlay({ label = 'Loading...' }: LoadingOverlayProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-3">
        <p className="text-white/80 font-medium animate-pulse text-5xl">{label}</p>
      </div>
    </div>
  );
}


