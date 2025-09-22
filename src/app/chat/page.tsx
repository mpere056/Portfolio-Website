import ChatUI from '@/components/ChatUI';
import NavHomeIcon from '@/components/NavHomeIcon';

export default function ChatPage() {
  return (
    <div className="flex flex-col h-screen bg-[#07070d] text-white">
      <NavHomeIcon />
      <div className="flex-shrink-0 text-center py-4 px-4">
        <h1 className="text-xl sm:text-2xl font-bold">
          <span className="bg-[linear-gradient(90deg,#60a5fa,#a78bfa,#f472b6,#60a5fa)] bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]">AI Chat</span>
        </h1>
      </div>
      <div className="flex-1 min-h-0">
        <ChatUI />
      </div>
    </div>
  );
}
