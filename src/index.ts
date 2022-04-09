import express, { Express } from "express";
import { Account } from "./interfaces";
import { router } from "./routes";

const app: Express = express();

export let accounts: Account[] = [];

app.use(express.json());
app.use(router);

if (process.env.NODE_ENV !== "test") {
  app.listen(3001);
}

export default app;
