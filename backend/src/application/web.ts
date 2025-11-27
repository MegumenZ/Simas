import express from "express";
import cors from "cors";
import { publicRouter } from "../route/public-api";
import { errorMiddleware } from "../middleware/error-middleware";
import { apiRouter } from "../route/api";
import { dashboardRouter } from "../route/dashboard-api";
import dotenv from "dotenv";

dotenv.config();

// Split the environment variable by comma so you can support multiple URLs if needed
const ALLOWED_ORIGINS = (process.env.WEB_ORIGIN || "http://localhost:3000").split(",");

export const web = express();
web.use(
  cors({
    origin: (requestOrigin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!requestOrigin) return callback(null, true);
      
      // Check if the incoming origin is in our allowed list
      if (ALLOWED_ORIGINS.includes(requestOrigin)) {
        callback(null, true);
      } else {
        // LOG THE BLOCKED ORIGIN so you can see it in Cloud Run Logs
        console.error(`Blocked by CORS. Incoming: ${requestOrigin} | Allowed: ${ALLOWED_ORIGINS}`);
        callback(new Error(`CORS: Origin ${requestOrigin} not allowed`));
      }
    },
    credentials: true, 
    exposedHeaders: ["Content-Disposition"],
    allowedHeaders: ["X-API-TOKEN", "Content-Type"],
  })
);

web.use(express.json());
web.use(publicRouter);
web.use(dashboardRouter);
web.use(apiRouter);
web.use(errorMiddleware);
