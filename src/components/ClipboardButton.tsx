'use client';
import { useState } from 'react';
import { motion } from '@/components/FramerMotion';
import { copyToClipboard } from '@/lib/clipboard';

interface ClipboardButtonProps {
  textToCopy: string;
}

export default function ClipboardButton({ textToCopy }: ClipboardButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(textToCopy);
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <motion.button
      onClick={handleCopy}
      className="mt-2 p-2 w-full text-left bg-zinc-700/60 hover:bg-zinc-600/60 rounded-lg text-sm transition-colors border border-white/20"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between font-mono">
        <span>{textToCopy}</span>
        <span>{isCopied ? 'Copied!' : 'Copy'}</span>
      </div>
    </motion.button>
  );
}
