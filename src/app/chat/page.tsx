import ChatUI from '@/components/ChatUI';
import NavHomeIcon from '@/components/NavHomeIcon';

export default function ChatPage() {
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <NavHomeIcon />
      <div className="flex-shrink-0 text-center py-4 px-4">
        <h1 className="text-xl sm:text-2xl font-bold">AI Chat</h1>
      </div>
      <div className="flex-1 min-h-0">
        <ChatUI />
      </div>
    </div>
  );
}
