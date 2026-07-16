import type { Message } from 'ai';
import {
  isDepthStage,
  isDestinationId,
  isExperienceId,
  isNodeId,
  isRelationshipId,
  type PortfolioAIContext,
} from '../portfolioContracts';

export interface ChatRequestContext {
  nodeId?: PortfolioAIContext['nodeId'];
  destinationId?: PortfolioAIContext['destinationId'];
  experienceId?: PortfolioAIContext['experienceId'];
  depthStage?: PortfolioAIContext['depthStage'];
  selectedRelationshipId?: PortfolioAIContext['selectedRelationshipId'];
}

export interface ParsedChatRequest {
  messages: Message[];
  context?: ChatRequestContext;
  contextStatus: 'absent' | 'accepted' | 'rejected';
}

export interface ChatRequestParseResult {
  ok: boolean;
  value?: ParsedChatRequest;
  error?: string;
}

const MAX_MESSAGES = 50;
const MAX_MESSAGE_LENGTH = 12_000;

function parseMessages(value: unknown): Message[] | undefined {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_MESSAGES) return undefined;
  const messages: Message[] = [];
  for (const candidate of value) {
    if (!candidate || typeof candidate !== 'object') return undefined;
    const message = candidate as Record<string, unknown>;
    if (!['user', 'assistant', 'system'].includes(String(message.role))) return undefined;
    if (typeof message.content !== 'string' || message.content.length > MAX_MESSAGE_LENGTH) return undefined;
    messages.push({
      id: typeof message.id === 'string' ? message.id : `request-${messages.length}`,
      role: message.role as Message['role'],
      content: message.content,
    });
  }
  return messages;
}

function parseContext(value: unknown): ChatRequestContext | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  const input = value as Record<string, unknown>;
  const context: ChatRequestContext = {};
  if (input.nodeId !== undefined) {
    if (typeof input.nodeId !== 'string' || !isNodeId(input.nodeId)) return undefined;
    context.nodeId = input.nodeId;
  }
  if (input.destinationId !== undefined) {
    if (typeof input.destinationId !== 'string' || !isDestinationId(input.destinationId)) return undefined;
    context.destinationId = input.destinationId;
  }
  if (input.experienceId !== undefined) {
    if (typeof input.experienceId !== 'string' || !isExperienceId(input.experienceId)) return undefined;
    context.experienceId = input.experienceId;
  }
  if (input.depthStage !== undefined) {
    if (typeof input.depthStage !== 'string' || !isDepthStage(input.depthStage)) return undefined;
    context.depthStage = input.depthStage;
  }
  if (input.selectedRelationshipId !== undefined) {
    if (
      typeof input.selectedRelationshipId !== 'string'
      || !isRelationshipId(input.selectedRelationshipId)
    ) return undefined;
    context.selectedRelationshipId = input.selectedRelationshipId;
  }
  return context;
}

export function parseChatRequest(value: unknown): ChatRequestParseResult {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { ok: false, error: 'Chat request must be an object' };
  }
  const input = value as Record<string, unknown>;
  const messages = parseMessages(input.messages);
  if (!messages) return { ok: false, error: 'Chat messages are invalid' };
  if (input.context === undefined) {
    return { ok: true, value: { messages, contextStatus: 'absent' } };
  }
  const context = parseContext(input.context);
  return context
    ? { ok: true, value: { messages, context, contextStatus: 'accepted' } }
    : { ok: true, value: { messages, contextStatus: 'rejected' } };
}

export function serializeChatRequestContext(context: PortfolioAIContext): ChatRequestContext {
  return {
    ...(context.nodeId ? { nodeId: context.nodeId } : {}),
    ...(context.destinationId ? { destinationId: context.destinationId } : {}),
    ...(context.experienceId ? { experienceId: context.experienceId } : {}),
    ...(context.depthStage ? { depthStage: context.depthStage } : {}),
    ...(context.selectedRelationshipId
      ? { selectedRelationshipId: context.selectedRelationshipId }
      : {}),
  };
}
