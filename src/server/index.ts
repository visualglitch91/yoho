import express from "express";
import ViteExpress from "vite-express";
import env from "./env";
import { createAxiosProxy } from "./utils";
import jdownloader from "./jdownloader";
import transmission from "./transmission";

const port = Number(env.PORT);
const app = express();

ViteExpress.config({
  mode: env.PROD ? "production" : "development",
});

app.use(express.json());

createAxiosProxy(app, "/api/radarr", env.RADARR_API, {
  "X-Api-Key": env.RADARR_API_KEY,
});

createAxiosProxy(app, "/api/sonarr", env.SONARR_API, {
  "X-Api-Key": env.SONARR_API_KEY,
});

createAxiosProxy(app, "/api/prowlarr", env.PROWLARR_API, {
  "X-Api-Key": env.PROWLARR_API_KEY,
});

app.use("/api/jdownloader", jdownloader);
app.use("/api/transmission", transmission);

ViteExpress.listen(app, port, () =>
  console.log("Server is listening at port", port)
);

const shutdown = () => process.exit();

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
