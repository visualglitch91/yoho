import axios from "axios";
import env from "./env";
import { Router } from "express";

const host = env.SWITCH_SHOP;

const nswitch = Router();

nswitch.get("/games", (_, res) => {
  axios.get(`${host}/json`).then(
    ({ data }) => res.send(data),
    (err) => res.sendStatus(500).send({ error: err?.message })
  );
});

export default nswitch;
