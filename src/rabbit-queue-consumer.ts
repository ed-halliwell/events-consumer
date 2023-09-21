import amqplib, { Channel } from "amqplib";
import { SourceEnum } from "./types";
import { Log } from "./Log";

export class MessageQueueConsumer {
  private queueName: string;

  private queueUrl: string;

  constructor(queueName: string, queueUrl: string) {
    this.queueName = queueName;
    this.queueUrl = queueUrl;
  }

  async createRabbitConnection(): Promise<Channel> {
    const connection = await amqplib.connect(this.queueUrl);

    const channel = await connection.createChannel();

    channel.assertQueue(this.queueName, { durable: true });

    return channel;
  }

  async consumeMessages(channel: Channel) {
    await channel.consume(
      this.queueName,
      (message) => {
        if (message) {
          Log.convertToEnhancedLog(
            SourceEnum.rabbit,
            JSON.parse(message.content.toString())
          );
          console.log(` [/] Message successfully received from RabbitMQ`);
        }
      },
      { noAck: true }
    );
  }
}
