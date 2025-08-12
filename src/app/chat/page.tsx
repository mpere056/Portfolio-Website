import ChatUI from '@/components/ChatUI';
import NavHomeIcon from '@/components/NavHomeIcon';

export default function ChatPage() {
  return (
    <div className="flex flex-col items-center justify-between h-screen bg-gray-900 text-white">
      <NavHomeIcon />
      <h1 className="text-2xl font-bold p-4">AI Chat</h1>
      <ChatUI />
    </div>
  );
}
