import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";


const app = express();

app.use(express.json());
app.use(cors()); 

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
    res.json(user);
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




app.listen(3003, () => {
  console.log("Server is running on http://localhost:3003");
});
