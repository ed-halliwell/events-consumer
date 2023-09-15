import amqplib, { Channel } from "amqplib";
import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import { EnhancedLog, RawLog } from "./types";

dotenv.config();

const port = process.env.PORT;
const queueName = process.env.QUEUE_NAME ?? "";
const queueUrl = process.env.QUEUE_URL ?? "";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const logs: EnhancedLog[] = [];

(async () => {
  try {
    const connection = await amqplib.connect(queueUrl ?? "amqp://localhost");
    const channel: Channel = await connection.createChannel();

    await channel.consume(
      queueName,
      (message) => {
        if (message) {
          const log: RawLog = JSON.parse(message.content.toString());

          console.log(` [x] Received ${JSON.stringify(log)}`);

          const delayInSeconds =
            Math.floor(new Date(Date.now()).getTime() / 1000) -
            Math.floor(new Date(log.sentAt).getTime() / 1000);

          logs.push({
            receivedAt: new Date(Date.now()),
            sentAt: new Date(log.sentAt),
            delayInSeconds,
            message: log.message,
          });
        }
      },
      { noAck: true }
    );

    console.log(" [*] Waiting for messages. To exit press CTRL+C");
  } catch (err) {
    console.warn(err);
  }
})();

app.get("/", async (req: Request, res: Response) => {
  res.send(`<html><h1>Logs</h1> <p>${JSON.stringify(logs)}</p></html>`);
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
