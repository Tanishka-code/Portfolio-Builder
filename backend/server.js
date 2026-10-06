import dotenv from "dotenv";

dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import process from "node:process";
import { resolveSrv } from "node:dns/promises";

import portfolioRoutes from "./routes/portfolioRoutes.js";

const app = express();

const allowedOrigins = new Set(
  (process.env.FRONTEND_ORIGINS || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
}));
app.use(express.json({ limit: "100kb" }));

const databaseIsConnected = () => mongoose.connection.readyState === 1;

app.use(
  "/api/portfolio",
  (req, res, next) => {
    if (!databaseIsConnected()) {
      return res.status(503).json({
        success: false,
        message: "Database temporarily unavailable. Please try again shortly.",
      });
    }
    return next();
  }
);

app.use(
  "/api/portfolio",
  portfolioRoutes
);

app.get("/", (req, res) => {
  res.send(
    "Portfolio Builder API Running"
  );
});

app.get("/health", (req, res) => {
  const readyState = mongoose.connection.readyState;
  const database = readyState === 1
    ? "connected"
    : readyState === 2
      ? "connecting"
      : "disconnected";
  return res.status(readyState === 1 ? 200 : 503).json({
    server: "ok",
    database,
  });
});

const PORT = Number(process.env.PORT) || 5000;

mongoose.connection.on("connected", () => {
  console.info("MongoDB connection established");
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB connection lost");
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error", {
    name: error?.name || "Error",
    code: error?.code || "unknown",
  });
});

const getMongoUri = () => {
  const uri = process.env.MONGO_URI?.trim();
  if (!uri) {
    const error = new Error("MONGO_URI is not configured");
    error.startupCategory = "configuration";
    throw error;
  }

  const separator = uri.indexOf("://");
  const scheme = separator < 0 ? "" : uri.slice(0, separator).toLowerCase();
  if (!["mongodb+srv", "mongodb"].includes(scheme)) {
    const error = new Error("MONGO_URI is not a valid MongoDB connection string");
    error.startupCategory = "invalid URI";
    throw error;
  }

  const remainder = uri.slice(separator + 3);
  const authorityEnd = ["/", "?", "#"]
    .map((character) => remainder.indexOf(character))
    .filter((index) => index >= 0)
    .reduce((end, index) => Math.min(end, index), remainder.length);
  const authority = remainder.slice(0, authorityEnd);
  const host = authority.slice(authority.lastIndexOf("@") + 1).split(",")[0].split(":")[0];
  if (!host) {
    const error = new Error("MONGO_URI is missing a MongoDB host");
    error.startupCategory = "invalid URI";
    throw error;
  }

  const path = remainder.slice(authorityEnd).split("?")[0].split("#")[0];
  return {
    uri,
    srvHost: scheme === "mongodb+srv" ? host : "",
    hasDatabase: path.length > 1,
  };
};

const diagnoseMongoError = (error) => {
  const message = `${error.name || ""} ${error.message || ""}`.toLowerCase();
  const code = error.code || error.cause?.code;

  if (error.startupCategory) {
    return { category: error.startupCategory, advice: "Check the backend environment configuration." };
  }
  if (code === 18 || /authentication failed|bad auth|auth failed/.test(message)) {
    return { category: "authentication failure", advice: "Check the Atlas database username and password in backend/.env. Percent-encode reserved characters in credentials." };
  }
  if (/querysrv|enotfound|eai_again|dns|srv record|getaddrinfo/.test(`${code || ""} ${message}`.toLowerCase())) {
    return { category: "DNS/SRV resolution failure", advice: "Node could not resolve the Atlas SRV record. Check the DNS resolver used by Node and the Windows/network DNS configuration." };
  }
  if (/not whitelisted|ip address.*(not|denied)|network access list/.test(message)) {
    return { category: "Atlas IP access-list issue", advice: "Add this machine's current public IP to Atlas Network Access, or correct the configured Atlas access-list entry." };
  }
  if (["ECONNREFUSED", "ETIMEDOUT", "ENETUNREACH", "ECONNRESET"].includes(code)) {
    return { category: "network connection failure (or Atlas IP access-list issue)", advice: "Check outbound access to Atlas on TCP 27017, VPN/firewall rules, and the Atlas Network Access IP list. These causes can produce the same timeout/refusal." };
  }
  if (/mongoparseerror|invalid scheme|invalid connection string/.test(message)) {
    return { category: "invalid MongoDB URI", advice: "Check the mongodb+srv:// format and percent-encode reserved characters in the username or password." };
  }
  return { category: "MongoDB connection failure", advice: "Check the backend environment and Atlas connectivity." };
};

const startServer = async () => {
  const { srvHost, hasDatabase } = getMongoUri();

  if (srvHost) {
    try {
      const records = await resolveSrv(`_mongodb._tcp.${srvHost}`);
      if (records.length === 0) {
        const error = new Error("Atlas SRV query returned no records");
        error.code = "ENODATA";
        throw error;
      }
      console.info(`Atlas SRV DNS lookup succeeded (${records.length} record(s))`);
    } catch (cause) {
      const error = new Error("Atlas SRV DNS lookup failed");
      error.code = cause.code;
      error.cause = cause;
      throw error;
    }
  }

  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });

  if (!hasDatabase) {
    console.warn("MONGO_URI has no database name; MongoDB will use its default database. Add /<DATABASE_NAME> to the URI if you intend to use a named database.");
  }

  app.listen(PORT, () => {
    console.info(`Server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  const diagnosis = diagnoseMongoError(error);
  console.error(`Server startup failed (${diagnosis.category}).`);
  console.error(diagnosis.advice);
  if (error.code || error.cause?.code) {
    console.error(`Diagnostic code: ${error.code || error.cause.code}`);
  }
  process.exit(1);
});
