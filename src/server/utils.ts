import { Express } from "express";
import axios from "axios";

export function createAxiosProxy(
  app: Express,
  path: string,
  baseURL: string,
  headers: Record<string, string>
) {
  const api = axios.create({ baseURL, headers });

  app.use(path, async (req, res) => {
    console.log({
      url: req.url,
      method: req.method,
      headers: req.headers,
      body: req.body,
    });

    try {
      const response = await api.request({
        url: req.url,
        method: req.method,
        data: req.body,
        headers: { "content-type": req.headers["content-type"] },
        responseType: "stream",
      });

      res.status(response.status);
      res.header(response.headers);
      response.data.pipe(res);
    } catch (err: any) {
      res.status(err.response?.status || 500).send(err.message);
    }
  });
}
