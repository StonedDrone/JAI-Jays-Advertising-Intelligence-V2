
export interface CodexEntry {
  id: string;
  source: string;
  summary: string;
  protocolName: string;
  capabilityDescription: string;
}

export enum MessageAuthor {
  USER = 'user',
  AI = 'ai',
}

export interface ChatMessage {
  id: string;
  author: MessageAuthor;
  text: string;
}

export enum AppView {
  REPOS = 'repos',
  CHAT = 'chat',
}
