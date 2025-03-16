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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true
}));
app.use((0, cookie_parser_1.default)());
const client = new client_1.PrismaClient();
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const details = req.body;
        const user = yield client.user.create({
            data: {
                name: details.name,
                email: details.email,
                password: details.password,
            },
        });
        if (user) {
            res.cookie('user', user.id, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // true in production
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            });
            res.json(user);
        }
        else {
            res.status(401).json({ error: "Invalid email or password" });
        }
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "An error occurred while creating the user." });
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const details = req.body;
        const user = yield client.user.findMany({
            where: {
                email: details.email,
                password: details.password
            }
        });
        res.json(user);
    }
    catch (error) {
        console.error("Error while signin:", error);
        res.status(500).json({ error: "error while signin" });
    }
}));
app.get("/api/v1/availabletriggers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield client.availableTrigger.findMany({
        where: {}
    });
    console.log(data);
    res.json(data);
}));
app.get("/api/v1/availableactions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield client.availableAction.findMany({
        where: {}
    });
    console.log(data);
    res.json(data);
}));
app.post("/api/v1/createzap", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ownerId = parseInt(req.body.ownerId);
    // const userId = parseInt(req.body.ownerId);
    const zapId = yield client.zap.create({
        data: {
            name: req.body.name,
            ownerId: ownerId,
        }
    });
    console.log(zapId);
    const ZapTrigger = yield client.trigger.create({
        data: {
            zapId: zapId.id,
            typeId: req.body.triggerId,
        }
    });
    console.log(ZapTrigger);
    const ZapActions = yield client.action.create({
        data: {
            zapId: zapId.id,
            actionId: req.body.actionId,
        }
    });
    console.log(ZapActions);
    res.json({ zapId });
}));
app.get("/api/v1/zaps/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = parseInt(req.params.userId);
        const zaps = yield client.zap.findMany({
            where: {
                ownerId: userId
            },
            include: {
                trigger: {
                    include: {
                        type: true
                    }
                },
                actions: {
                    include: {
                        action: true
                    }
                }
            }
        });
        res.json(zaps);
    }
    catch (error) {
        console.error("Error fetching zaps:", error);
        res.status(500).json({ error: "Failed to fetch zaps" });
    }
}));
app.listen(3003, () => {
    console.log("Server is running on http://localhost:3003");
});
