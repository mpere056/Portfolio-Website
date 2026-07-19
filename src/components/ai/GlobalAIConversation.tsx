'use client';

import ChatUI from '@/components/ChatUI';
import { usePortfolioAI } from './PortfolioAIProvider';
import { useExplorationWorld } from '@/components/experience/ExplorationWorldProvider';
import type { ResolvedArchiveCard } from '@/lib/ai/archiveCards';

export default function GlobalAIConversation() {
  const { context, shell, initialPrompt, reportRequestState, close } = usePortfolioAI();
  const { store } = useExplorationWorld();
  const handleArchiveCardOpen = (card: ResolvedArchiveCard) => {
    store.getState().applyDepthTransition(card.sourceNodeIds[0], {
      destinationId: card.destinationId,
      stage: card.requestedDepth,
      safeState: card.safeState,
    });
    close();
  };
  return (
    <ChatUI
      compact
      resetSignal={shell.conversationVersion}
      onActivityChange={reportRequestState}
      context={context}
      initialPrompt={initialPrompt}
      onArchiveCardOpen={handleArchiveCardOpen}
    />
  );
}
