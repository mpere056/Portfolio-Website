'use client';

import ChatUI from '@/components/ChatUI';
import { usePortfolioAI } from './PortfolioAIProvider';

export default function GlobalAIConversation() {
  const { shell, reportRequestState } = usePortfolioAI();
  return (
    <ChatUI
      compact
      resetSignal={shell.conversationVersion}
      onActivityChange={reportRequestState}
    />
  );
}
