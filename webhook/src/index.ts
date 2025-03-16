import { PrismaClient } from "@prisma/client";
import express from "express";

const app = express();

app.use(express.json())
const client = new PrismaClient
app.post("/hook/catch/:userId/:zapId",async (req,res)=>{
    const userId = req.params.userId;
    const zapId = req.params.zapId;
    const body = req.body;
     console.log("1");
    await client.$transaction(async tx =>{
        const run = await tx.zapRun.create({
            data: {
                zapId:zapId,
                metadata:body  
            }
        });
        console.log("2");
        await tx.zapOutbox.create({
            data:{
                ZapRunId : run.id
            }
        })
        console.log("3");
    })
    console.log("4");

    res.json("ok");
})

app.listen(3000);