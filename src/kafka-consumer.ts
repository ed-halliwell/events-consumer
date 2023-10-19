import {
  Consumer,
  ConsumerSubscribeTopics,
  EachMessagePayload,
  Kafka,
} from "kafkajs";
import { Log } from "./Log";
import { SourceEnum } from "./types";

export class MyKafkaConsumer {
  private kafkaConsumer: Consumer;

  private clientId: string;

  private topicName: string;

  public constructor(clientId: string, topicName: string) {
    this.clientId = clientId;
    this.topicName = topicName;
    this.kafkaConsumer = this.#createKafkaConsumer();
  }

  public async startConsumer(): Promise<void> {
    const topic: ConsumerSubscribeTopics = {
      topics: [this.topicName],
      fromBeginning: false,
    };

    try {
      await this.kafkaConsumer.connect();
      await this.kafkaConsumer.subscribe(topic);

      await this.kafkaConsumer.run({
        eachMessage: async (messagePayload: EachMessagePayload) => {
          const { message } = messagePayload;
          Log.convertToEnhancedLog(
            SourceEnum.kafka,
            JSON.parse(message?.value?.toString() ?? "Empty message!")
          );
          console.log(` [/] Message successfully received from Kafka`);
        },
      });
    } catch (error) {
      console.log(" [X] Error: ", error);
    }
  }

  public async shutdown(): Promise<void> {
    await this.kafkaConsumer.disconnect();
  }

  #createKafkaConsumer(): Consumer {
    const kafka = new Kafka({
      clientId: this.clientId,
      brokers: ["kafka:9092"],
    });
    const consumer = kafka.consumer({ groupId: "consumer-group" });
    return consumer;
  }
}
