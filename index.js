const cors = require("cors");
const pino = require("pino");
const axios = require("axios");
const morgan = require("morgan");
const dotenv = require("dotenv");
const express = require("express");

const util = require("./util");

dotenv.config();

const app = express();
const port = process.env.PORT || 2010;
const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

const prefix = "target-";
const proxyHeader = (req, key) => {
  const url = req.headers[prefix + key];

  if (!url) return;

  delete req.headers[prefix + key];

  return url;
};

app.all("/api", async (req, res) => {
  try {
    const options = req.body.options;
    const destination = proxyHeader(req, "url");

    if (!destination) {
      logger.warn("Invalid Target URL");
      return res.status(404).json({ msg: "Invalid Target URL" });
    }

    logger.info(`Request: [${destination}] Method: [${req.method}]`);

    const config = {
      url: destination,
      method: req.method,
      data: req.body,
      responseType: "arraybuffer",
    };

    const resp = await axios(config);
    const isXml = resp.headers["content-type"].includes("application/xml");

    const data = isXml ? await util.xml2json(resp.data) : resp.data;

    logger.info({
      axiosConfig: config,
      response: data.length > 200 ? "Too Large String" : data,
    });

    const base64 = Buffer.from(data, "binary").toString("base64");
    res.send(base64);
  } catch (err) {
    const isJson = typeof err.toJSON === "function";
    const resp = isJson ? err.toJSON : err;

    logger.warn(resp);
    res.json(resp);
  }
});

app.listen(port, () => {
  logger.info(`cors-proxy server is listening on port ${port}`);
});
