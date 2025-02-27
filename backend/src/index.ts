import express from "express";
import dotenv from "dotenv";
import "./llm/llm";
import router from "./routes";
import cors from 'cors'

dotenv.config();

const port = 8000;
const app = express();


const options:cors.CorsOptions={
  origin:"http://localhost:3000",
  credentials:true,
  methods : ["POST","GET"]
}

app.use(express.json({limit : "50mb"}));
app.use(express());
app.use(cors(options))


app.use("/api" ,router);

app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
