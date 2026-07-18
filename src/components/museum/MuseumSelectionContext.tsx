'use client';

import { useEffect } from 'react';
import { usePortfolioAI } from '@/components/ai/PortfolioAIProvider';
import type { MuseumExhibitView } from '@/lib/museum/types';
import type { DepthStage } from '@/lib/portfolioContracts';

export default function MuseumSelectionContext({
  exhibit,
  stage,
}: {
  exhibit: MuseumExhibitView;
  stage: DepthStage;
}) {
  const { pushContext, popContext } = usePortfolioAI();

  useEffect(() => {
    pushContext('museum-selection', {
      destinationId: exhibit.destinationId,
      nodeId: exhibit.projectId,
      ...(exhibit.experienceId ? { experienceId: exhibit.experienceId } : {}),
      depthStage: stage,
    });
    return () => popContext('museum-selection');
  }, [exhibit, popContext, pushContext, stage]);

  return null;
}
