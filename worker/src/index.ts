import { PrismaClient } from '@prisma/client';
import { Kafka } from 'kafkajs';
import nodemailer from 'nodemailer';
import { notionfxn } from './notion';




const TOPIC_NAME = "test-topic";
const client = new PrismaClient();
const kafka = new Kafka({
  clientId: 'outbox-processor',
  brokers: ['localhost:9092'],
});

async function sendEmail(zapRunId: string) {
  console.log("Processing zapRunId:", zapRunId);
  
  let data = await client.zapRun.findMany({
    where: { id: zapRunId },
    select: { metadata: true }
  });

  if (data.length === 0) {
    console.error("No data found for zapRunId:", zapRunId);
    return;
  }

  console.log("Fetched metadata:", data[0].metadata);

  let meta: any = data[0].metadata as { email?: string; subject?: string; text?: string };

  if (!meta?.to) {
    console.error("❌ Email recipient is missing:", meta);    
    return;
  }

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  let mailOptions = {
    to: meta.to,
    subject: meta.subject || "No Subject",
    text: meta.text || "No Text",
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.response);
  } catch (error) {
    
    console.error("❌ Error sending email:", error);
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

        console.log("Searching for zapId in action table:", zapRunId);

        let data1 = await client.zapRun.findMany({
          where: { id: zapRunId },
          select: { zapId: true }
        });
        let zapRunId1 = data1[0].zapId


        
        let data = await client.action.findMany({
        where: { zapId: zapRunId1 },
        select: { actionId: true }
        });
console.log("Fetched action data:", data);

        if (data.length === 0) {
          console.error("No data found for zapRunId:", zapRunId);
          return;
        }

        if(data[0].actionId=="ffba60fa-471d-44d1-858d-a971e670493a"){
          console.log("Notion")

          let data = await client.zapRun.findMany({
            where: { id: zapRunId },
            select: { metadata: true }
          });
        
          if (data.length === 0) {
            console.error("No data found for zapRunId:", zapRunId);
            return;
          }
        
          console.log("Fetched metadata:", data[0].metadata);
        
          let meta: any = data[0].metadata as { text?:string };

          notionfxn(meta)
        }
        else{
          if (zapRunId) {
            await sendEmail(zapRunId);
          }
        }       
      }
    },
  });
}

main().catch(console.error);
