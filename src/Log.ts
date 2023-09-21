import { EnhancedLog, RawLog, SourceEnum } from "./types";

export let store: EnhancedLog[] = [];

export class Log {
  static convertToEnhancedLog(source: SourceEnum, rawLog: RawLog): EnhancedLog {
    const delayInSeconds =
      Math.floor(new Date(Date.now()).getTime() / 1000) -
      Math.floor(new Date(rawLog.sentAt).getTime() / 1000);

    const enhancedLog = {
      source,
      receivedAt: new Date(Date.now()),
      sentAt: new Date(rawLog.sentAt),
      delayInSeconds,
      message: rawLog.message,
    };

    store.push(enhancedLog);
    return enhancedLog;
  }
}
