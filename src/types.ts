export interface RawLog {
  sentAt: Date;
  message: string;
}

export enum SourceEnum {
  kafka = "kafka",
  rabbit = "rabbit",
}

export interface EnhancedLog {
  source: SourceEnum;
  receivedAt: Date;
  sentAt: Date;
  delayInSeconds: number;
  message: string;
}
