import cors from "cors";
import express from "express";
import { router } from "./routes";

const app = express();

// Dev-scoped: lets the chrome-extension origin push captured assignments
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use("/", router);

const PORT = 8787;
app.listen(PORT, "127.0.0.1", () => {
  console.log(`Responsum sync server listening on http://127.0.0.1:${PORT}`);
});