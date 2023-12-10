import axios from "axios";
import env from "./env";
import { Router } from "express";

const host = env.TRANSMISSION_API;

let sessionId = "";
let tagCounter = 1;

async function request<T = object>(method: string, params: any): Promise<T> {
  const body = { method, arguments: params, tag: tagCounter++ };

  return axios
    .post(`${host}/transmission/rpc`, body, {
      headers: sessionId ? { "x-transmission-session-id": sessionId } : {},
    })
    .then(
      (res: any) => {
        if (res.data.result === "success") {
          return res.data.arguments;
        }

        throw res.data;
      },
      (error) => {
        if (error.response?.status) {
          const sessionIdValue =
            error.response?.headers["x-transmission-session-id"];

          if (sessionIdValue) {
            sessionId = sessionIdValue;
            //@ts-expect-error
            return request(body);
          }
        }

        throw error;
      }
    );
}

const transmission = Router();

transmission.get("/torrents", (_, res) => {
  request("torrent-get", {
    fields: [
      "id",
      "name",
      "percentDone",
      "uploadRatio",
      "rateDownload",
      "rateUpload",
      "downloadedEver",
      "uploadedEver",
      "totalSize",
      "addedDate",
      "status",
      "errorString",
      "activityDate",
      "sizeWhenDone",
      "eta",
      "recheckProgress",
      "queuePosition",
      "downloadDir",
    ],
  }).then(
    (response: any) => res.send(response.torrents),
    (err) => res.status(500).send(err?.message)
  );
});

transmission.post("/downloads", (req, res) => {
  request("torrent-add", {
    start: true,
    bandwidthPriority: 0,
    downloadDir: "",
    paused: false,
    filename: req.body.magnet,
  }).then(
    () => res.send({ success: true }),
    (err) => res.status(500).send(err?.message)
  );
});

transmission.post("/start", (req, res) => {
  request("torrent-start", {
    ids: req.body.ids.map(Number),
  }).then(
    () => res.send({ success: true }),
    (err) => res.status(500).send(err?.message)
  );
});

transmission.post("/stop", (req, res) => {
  request("torrent-stop", {
    ids: req.body.ids.map(Number),
  }).then(
    () => res.send({ success: true }),
    (err) => res.status(500).send(err?.message)
  );
});

transmission.post("/delete", (req, res) => {
  request("torrent-remove", {
    ids: req.body.ids.map(Number),
    "delete-local-data": req.body.deleteData,
  }).then(
    () => res.send({ success: true }),
    (err) => res.status(500).send(err?.message)
  );
});

export default transmission;
