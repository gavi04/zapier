import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';


const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true
}));
app.use(cookieParser());

const client = new PrismaClient();

app.post("/api/v1/signup", async (req, res) => {
  try {
    const details = req.body;
    const user = await client.user.create({
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
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "An error occurred while creating the user." });
  }
});

app.post("/api/v1/signin",async (req,res)=>{
    try{
        const details = req.body;
        const user = await client.user.findMany({
            where:{
                email:details.email,
                password:details.password
            }
        }) 
        res.json(user)
    }
    catch (error) {
        console.error("Error while signin:", error);
        res.status(500).json({ error: "error while signin" });
      }
})

app.get("/api/v1/availabletriggers",async (req,res)=>{
     
    const data = await client.availableTrigger.findMany({
      where:{}
    })
    console.log(data)
    res.json(data)
})

app.get("/api/v1/availableactions",async (req,res)=>{
     
    const data = await client.availableAction.findMany({
      where:{}
    })
    console.log(data)
    res.json(data)
})
app.post("/api/v1/createzap",async (req,res)=>{
 
  const ownerId = parseInt(req.body.ownerId);
  // const userId = parseInt(req.body.ownerId);
  const zapId = await client.zap.create({
    data:{
      name:req.body.name,
      ownerId:ownerId,
    }
  })
  console.log(zapId);
  const ZapTrigger = await client.trigger.create({
    data:{
      zapId:zapId.id,
      typeId:req.body.triggerId,
    }
  })
  console.log(ZapTrigger);
  const ZapActions = await client.action.create({
    data:{
      zapId:zapId.id,
      actionId:req.body.actionId,  
    }
  })
  console.log(ZapActions);
  res.json({zapId})
})


app.get("/api/v1/zaps/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const zaps = await client.zap.findMany({
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
  } catch (error) {
    console.error("Error fetching zaps:", error);
    res.status(500).json({ error: "Failed to fetch zaps" });
  }
});









app.listen(3003, () => {
  console.log("Server is running on http://localhost:3003");
});
