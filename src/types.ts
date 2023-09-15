export interface RawLog {
  sentAt: Date;
  message: string;
}

export interface EnhancedLog {
  receivedAt: Date;
  sentAt: Date;
  delayInSeconds: number;
  message: string;
}
