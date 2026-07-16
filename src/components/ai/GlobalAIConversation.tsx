'use client';

import ChatUI from '@/components/ChatUI';
import { usePortfolioAI } from './PortfolioAIProvider';

export default function GlobalAIConversation() {
  const { context, shell, reportRequestState } = usePortfolioAI();
  return (
    <ChatUI
      compact
      resetSignal={shell.conversationVersion}
      onActivityChange={reportRequestState}
      context={context}
    />
  );
}
