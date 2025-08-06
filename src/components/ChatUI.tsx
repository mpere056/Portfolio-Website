'use client';

import { useChat } from 'ai/react';
import { motion, AnimatePresence } from 'framer-motion';

const samplePrompts = [
  'What are your most impressive projects?',
  'What was your experience with the $100k GPT-4 mobile-app offer?',
  'Tell me about your journey into coding.',
];

export default function ChatUI() {
  const { messages, input, setInput, handleInputChange, handleSubmit } = useChat();

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto flex-grow">
      <div className="flex-grow overflow-auto p-4">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center items-center h-full"
            >
              <div className="text-center">
                <h2 className="text-4xl font-bold">Hi, I&apos;m Mark</h2>
                <p className="text-lg text-gray-400">What would you like to know about me?</p>
              </div>
            </motion.div>
          ) : (
            messages.map(m => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex mb-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-4 rounded-2xl max-w-lg ${m.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'}`}
                >
                  <p className="font-bold mb-1">{m.role === 'user' ? 'You' : 'Assistant'}</p>
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="p-4">
        {messages.length === 0 && (
          <div className="flex justify-center space-x-4 mb-4">
            {samplePrompts.map(prompt => (
              <motion.button
                key={prompt}
                onClick={() => handlePromptClick(prompt)}
                className="px-4 py-2 bg-gray-800 text-white rounded-full text-sm"
                whileHover={{ scale: 1.05 }}
              >
                {prompt}
              </motion.button>
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <input
            className="w-full p-4 bg-gray-800 text-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            placeholder="Ask anything..."
            onChange={handleInputChange}
          />
        </form>
      </div>
    </div>
  );
}
