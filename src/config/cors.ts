import { CorsOptions } from "cors";

const corsOrigin = process.env.CORS_ORIGIN;

if (!corsOrigin) {
  throw new Error("Missing environment variable: CORS_ORIGIN");
}

export const corsOptions: CorsOptions = {
  origin: corsOrigin,
};