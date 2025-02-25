import express from "express";
import dotenv from "dotenv";
import "./llm/llm";
import routerTemplate from "./routes";

dotenv.config();

const port = 8000;
const app = express();

app.use(express.json());
app.use(express());

app.use(routerTemplate);

app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
