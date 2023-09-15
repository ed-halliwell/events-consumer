import amqplib, { Channel, Message } from "amqplib";

export class MessageQueueConsumer {
  private queueName: string;

  private queueUrl: string;

  private queue!: Channel;

  constructor(queueName: string, queueUrl: string) {
    this.queueName = queueName;
    this.queueUrl = queueUrl;
  }

  async connect() {
    const connection = await amqplib.connect(
      this.queueUrl ?? "amqp://localhost"
    );

    const channel = await connection.createChannel();
    this.queue = channel;

    process.once("SIGINT", async () => {
      await channel.close();
      await connection.close();
    });
    this.queue.assertQueue(this.queueName, { durable: true });
  }

  async getMessages() {
    await this.queue.consume(
      this.queueName,
      (msg: Message | null) => {
        console.log("RECEIVED MESSAGE: ", msg?.content.toString());
      },
      { noAck: true }
    );
  }
}
