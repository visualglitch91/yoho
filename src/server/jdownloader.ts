import { Router } from "express";
import { python } from "pythonia";
import env from "./env";

const apiPromise = python("./jdownloader.py");

class MyJdApi {
  private api: any;
  private email: string;
  private password: string;
  private deviceName: string;
  private connectionPromise: Promise<void> | null = null;

  constructor(email: string, password: string, deviceName: string) {
    this.email = email;
    this.password = password;
    this.deviceName = deviceName;
  }

  async connect() {
    if (!this.api) {
      this.api = await apiPromise.then((api) => {
        return api.API(this.email, this.password, this.deviceName);
      });
    }

    if (!this.connectionPromise) {
      this.connectionPromise = this.api.connect().catch(() => {});
      this.connectionPromise!.then(() => {
        this.connectionPromise = null;
      });
    }

    return this.connectionPromise;
  }

  private async awaitConnection() {
    if (this.connectionPromise) {
      await this.connectionPromise;
    }
  }

  async getLinks(): Promise<any[]> {
    await this.awaitConnection();

    const links = await this.api.get_links();

    if (links === null) {
      throw new Error("Could not get links");
    }

    const response = [];

    for await (const it of links) {
      response.push(await it.valueOf());
    }

    return response;
  }

  async addLink(url: string): Promise<void> {
    await this.awaitConnection();

    const result = await this.api.add_link(url);

    if (!result) {
      throw new Error("Could not add link");
    }
  }

  async deleteLinks(ids: string[]): Promise<void> {
    await this.awaitConnection();
    await this.api.delete_links(ids);
  }
}

const jdownloader = Router();

const api = new MyJdApi(
  env.JDOWNLOADER_EMAIL,
  env.JDOWNLOADER_PASSWORD,
  env.JDOWNLOADER_DEVICE
);

api.connect();

// Keep connection alive
setInterval(() => {
  api.getLinks();
}, 10 * 60_000);

jdownloader.get("/downloads", async (_, res) => {
  try {
    res.send(await api.getLinks());
  } catch (err: any) {
    res.status(500).send(err?.message);
  }
});

jdownloader.post("/add", async ({ body }, res) => {
  try {
    res.send(await api.addLink(body.url));
  } catch (err: any) {
    res.status(500).send(err?.message);
  }
});

jdownloader.post("/delete", async ({ body }, res) => {
  try {
    res.send(await api.deleteLinks(body.ids));
  } catch (err: any) {
    res.status(500).send(err?.message);
  }
});

export default jdownloader;
