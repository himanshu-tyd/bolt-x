import express from "express";
import dotenv from "dotenv";
import "./llm/llm";
import router from "./routes";

dotenv.config();

const port = 8000;
const app = express();

app.use(express.json({limit : "50mb"}));
app.use(express());


app.use("/api" ,router);

app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
