'use client';

import { useChat } from 'ai/react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingDots from './LoadingDots'; // Import the new component

const samplePrompts = [
  'Tell me about your journey into coding.',
  'Did you have setbacks during university?',
  'How did you get a $100k offer for a mobile app?',
  'How does this AI chatbot work?'
];

export default function ChatUI() {
  const { messages, input, setInput, handleInputChange, handleSubmit, isLoading } = useChat();

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto">
      <div className="flex-1 overflow-auto px-3 sm:px-4 py-2">
        <AnimatePresence mode="wait">
          {messages.length === 0 ? (
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
              {messages.map(m => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex mb-3 sm:mb-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`p-3 sm:p-4 rounded-2xl max-w-[85%] sm:max-w-lg ${
                      m.role === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-700 text-white'
                    }`}
                  >
                    <p className="font-bold mb-1 text-sm sm:text-base">
                      {m.role === 'user' ? 'You' : 'Assistant'}
                    </p>
                    <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
                      {m.content}
                    </p>
                  </div>
                </motion.div>
              ))}
              {/* Add loading indicator when the AI is thinking */}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex mb-3 sm:mb-4 justify-start"
                >
                  <div className="p-3 sm:p-4 rounded-2xl max-w-[85%] sm:max-w-lg bg-gray-700 text-white">
                    <p className="font-bold mb-1 text-sm sm:text-base">Assistant</p>
                    <LoadingDots />
                  </div>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-shrink-0 p-3 sm:p-4 bg-gray-900/80 backdrop-blur border-t border-gray-700">
        {messages.length === 0 && (
          <div className="mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
              {samplePrompts.map(prompt => (
                <motion.button
                  key={prompt}
                  onClick={() => handlePromptClick(prompt)}
                  className="p-2 sm:p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs sm:text-sm text-left leading-tight transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {prompt}
                </motion.button>
              ))}
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="relative">
          <input
            className="w-full p-3 sm:p-4 pr-12 sm:pr-16 bg-gray-800 text-white rounded-2xl sm:rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            value={input}
            placeholder="Ask anything..."
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-400 hover:text-blue-300 transition-colors"
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
