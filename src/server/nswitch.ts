import axios from "axios";
import env from "./env";
import { Router } from "express";

const host = env.SWITCH_SHOP;

const regex = /<a\s+data-icon="([^"]+)"\s+href="([^"]+)">([^<]+)<\/a>/g;

const nswitch = Router();

nswitch.get("/games", async (_, res) => {
  const html = await axios.get(host).then((res) => res.data);

  let match;
  const result = [];

  while ((match = regex.exec(html)) !== null) {
    const image = match[1];
    const href = `${host}/${match[2]}`;
    const title = match[3].trim().slice(0, -1);

    result.push({ image, href, title });
  }

  res.send(result);
});

export default nswitch;
