import { Router } from "express";
import { createProxyServer } from "http-proxy";
import env from "./env";

const rg351p = Router();

const proxy = createProxyServer({
  target: env.RG351P_MANAGER_HOST,
  changeOrigin: true,
});

rg351p.use((req, res) => {
  try {
    proxy.web(req, res);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
});

export default rg351p;
