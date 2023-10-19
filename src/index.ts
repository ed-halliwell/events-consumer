import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import { MyKafkaConsumer } from "./kafka-consumer";
import { MyRabbitMqConsumer } from "./rabbit-queue-consumer";
import { store } from "./Log";

dotenv.config();

const port = process.env.PORT;
const queueName = process.env.QUEUE_NAME ?? "";
const queueUrl = process.env.QUEUE_URL ?? "amqp://localhost";
const kafkaClientId = process.env.KAFKA_CLIENT_ID ?? "";
const kafkaTopicName = process.env.KAFKA_TOPIC_NAME ?? "";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// KAFKA CONSUMER
async function connectToKafka() {
  const kafka = new MyKafkaConsumer(kafkaClientId, kafkaTopicName);
  await kafka.startConsumer();
}
connectToKafka();

// RABBIT MQ CONSUMER
async function connectToRabbit() {
  const rabbit = new MyRabbitMqConsumer(queueName, queueUrl);
  const channel = await rabbit.createRabbitConnection();
  await rabbit.consumeMessages(channel);
}
connectToRabbit();

app.get("/", async (req: Request, res: Response) => {
  res.send(`<html><h1>Logs</h1> <p>${JSON.stringify(store)}</p></html>`);
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
