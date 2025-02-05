"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const kafkajs_1 = require("kafkajs");
const nodemailer_1 = __importDefault(require("nodemailer"));
const TOPIC_NAME = "test-topic";
const client = new client_1.PrismaClient();
const kafka = new kafkajs_1.Kafka({
    clientId: 'outbox-processor',
    brokers: ['localhost:9092'],
});
function sendEmail(zapRunId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Processing zapRunId:", zapRunId);
        let data = yield client.zapRun.findMany({
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
        let meta = data[0].metadata;
        let transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        let mailOptions = {
            // from: process.env.EMAIL_USER,
            to: meta === null || meta === void 0 ? void 0 : meta.email,
            subject: meta === null || meta === void 0 ? void 0 : meta.subject,
            text: meta === null || meta === void 0 ? void 0 : meta.text,
        };
        try {
            yield transporter.sendMail(mailOptions);
            console.log("Email sent successfully to:", meta === null || meta === void 0 ? void 0 : meta.email);
        }
        catch (error) {
            console.error("Error sending email:", error);
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const consumer = kafka.consumer({ groupId: 'main-worker' });
        yield consumer.connect();
        yield consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true });
        yield consumer.run({
            eachMessage: (_a) => __awaiter(this, [_a], void 0, function* ({ topic, partition, message }) {
                var _b;
                console.log({
                    partition,
                    offset: message.offset,
                    value: (_b = message.value) === null || _b === void 0 ? void 0 : _b.toString(),
                });
                if (message.value) {
                    const zapRunId = JSON.parse(message.value.toString()).zapRunId;
                    console.log("Received zapRunId:", zapRunId);
                    // Call sendEmail only when zapRunId is available
                    if (zapRunId) {
                        yield sendEmail(zapRunId);
                    }
                }
            }),
        });
    });
}
main().catch(console.error);
