require("dotenv").config();
const process = require("process");
const express = require("express");
const app = express();
const PaytmChecksum = require("./paytmChecksum");
const cors = require("cors");

const PORT = process.env.PORT || 3001; /// setting up PORT

///// Cors for
app.use(
  cors({
    origin: "http://localhost:3000", // allow url which can send request to this server
    methods: ["POST", "GET"], //
  })
);
///// parsing json
app.use(express.json());


const developers = []




app.get("/", (req, res) => {
  res.json({
    name: "aniket",
    id: "1",
    req: req.app.get("views"),
  });
});

app.get("/:id", (req, res) => {
  if (req.params.id == 0) {
    res.status(404).send("Id Should not be zero in Rout Parameter");
  } else {
    res.json({
      Id_params: req.params.id,
    });
  }
});

app.post("/", (req,res) => {
  const person = {
    id:req.body.id,
    name:req.body.name
  }
  
  developers.push(person)
  console.log("developers",developers)
  res.json(developers)
})

app.listen(PORT, () => {
  // this will open server s
  console.log(`listing on port ${process.env.PORT}`);
});

// const http = require("http");
// const server = http.createServer((req,res)=>{
//     res.end("Hello..... Message From Server Side");
// })
