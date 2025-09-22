'use client';

import { useChat } from 'ai/react';
import { motion, AnimatePresence } from '@/components/FramerMotion';
import LoadingDots from './LoadingDots'; // Import the new component
import ChatOrb from './ChatOrb';
import ClipboardButton from './ClipboardButton';
import { useCallback, useMemo } from 'react';

const samplePrompts = [
  'Tell me about your journey into coding.',
  'Did you have setbacks during university?',
  'How did you get a $100k offer for a mobile app?',
  'How does this AI chatbot work?'
];

export default function ChatUI() {
  const { messages, input, setInput, handleInputChange, handleSubmit, isLoading } = useChat();

  const handlePromptClick = useCallback((prompt: string) => {
    setInput(prompt);
  }, [setInput]);

  const chatStream = useMemo(() => ({ messages, isLoading }), [messages, isLoading]);

  const isThinking = isLoading && messages[messages.length - 1]?.role === 'user';

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto">
      <div className="flex-1 overflow-auto px-3 sm:px-4 py-2">
        <AnimatePresence mode="wait">
          {chatStream.messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center items-center h-full min-h-[200px]"
            >
              <div className="text-center px-4">
                <h2 className="text-2xl sm:text-4xl font-bold mb-2">Hi, I&apos;m Mark</h2>
                <p className="text-base sm:text-lg text-gray-400">What would you like to know about me?</p>
              </div>
            </motion.div>
          ) : (
            <>
              {chatStream.messages.map(m => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex mb-3 sm:mb-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`p-3 sm:p-4 rounded-2xl max-w-[85%] sm:max-w-lg ${
                      m.role === 'user' 
                        ? 'bg-sky-500/30 backdrop-blur-md text-white border border-sky-400/40' 
                        : 'bg-zinc-800/50 backdrop-blur-md text-white border border-white/20'
                    }`}
                  >
                    <p className="font-bold mb-1 text-sm sm:text-base">
                      {m.role === 'user' ? 'You' : 'Assistant'}
                    </p>
                    <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
                      {m.content.replace('[CONTACT_EMAIL]', '').trim()}
                    </p>
                    {m.content.includes('[CONTACT_EMAIL]') && (
                      <ClipboardButton textToCopy="marknperera@hotmail.com" />
                    )}
                  </div>
                </motion.div>
              ))}
              {/* Add loading indicator when the AI is thinking */}
              {chatStream.isLoading && chatStream.messages[chatStream.messages.length - 1]?.role === 'user' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex mb-3 sm:mb-4 justify-start"
                >
                  <div className="p-3 sm:p-4 rounded-2xl max-w-[85%] sm:max-w-lg bg-zinc-800/50 backdrop-blur-md text-white border border-white/20">
                    <p className="font-bold mb-1 text-sm sm:text-base">Assistant</p>
                    <LoadingDots />
                  </div>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-shrink-0 p-3 sm:p-4 bg-[#0a0a12]/80 backdrop-blur border-t border-white/10">
        {chatStream.messages.length === 0 && (
          <div className="mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
              {samplePrompts.map(prompt => (
                <motion.button
                  key={prompt}
                  onClick={() => handlePromptClick(prompt)}
                  className="p-2 sm:p-3 bg-zinc-800/80 hover:bg-zinc-700/80 text-white rounded-xl text-xs sm:text-sm text-left leading-tight transition-colors border border-white/10"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {prompt}
                </motion.button>
              ))}
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <div className="absolute left-3 sm:left-4 z-10">
            <ChatOrb isThinking={isThinking} />
          </div>
          <div className="relative w-full">
            <input
              className="w-full p-3 sm:p-4 pl-16 sm:pl-20 pr-12 sm:pr-16 bg-zinc-800/80 text-white rounded-2xl sm:rounded-full shadow-lg focus:outline-none border border-white/10 focus:border-transparent text-sm sm:text-base peer"
              value={input}
              placeholder="Ask anything..."
              onChange={handleInputChange}
            />
            <div className="absolute inset-0 rounded-2xl sm:rounded-full pointer-events-none border-2 border-transparent peer-focus:border-white/80 peer-focus:animate-pulse-border" />
          </div>
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-sky-400 hover:text-fuchsia-300 transition-colors"
            disabled={!input.trim()}
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </form>
        <p className="mt-2 text-center text-xs text-gray-500">
          Powered by AI with access to background information on Mark&apos;s life.
        </p>
      </div>
    </div>
  );
}
