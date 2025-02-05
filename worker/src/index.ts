import { PrismaClient } from '@prisma/client';
import { Kafka } from 'kafkajs';
import nodemailer from 'nodemailer';




const TOPIC_NAME = "test-topic";
const client = new PrismaClient();
const kafka = new Kafka({
  clientId: 'outbox-processor',
  brokers: ['localhost:9092'],
});

async function sendEmail(zapRunId: string) {
  console.log("Processing zapRunId:", zapRunId);
  
  let data = await client.zapRun.findMany({
    where: {
      id: zapRunId,
    },
    select: {
      metadata: true
    }
  });

  if (data.length === 0) {
    console.error("No data found for zapRunId:", zapRunId);
    return;
  }

  let meta: any = data[0].metadata as { email: string };

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
  });

  let mailOptions = {
    // from: process.env.EMAIL_USER,
    to: meta?.email,
    subject: meta?.subject,
    text: meta?.text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", meta?.email);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

async function main() {
  const consumer = kafka.consumer({ groupId: 'main-worker' });
  await consumer.connect();
  await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value?.toString(),
      });

      if (message.value) {
        const zapRunId = JSON.parse(message.value.toString()).zapRunId;
        console.log("Received zapRunId:", zapRunId);

        // Call sendEmail only when zapRunId is available
        if (zapRunId) {
          await sendEmail(zapRunId);
        }
      }
    },
  });
}

main().catch(console.error);
