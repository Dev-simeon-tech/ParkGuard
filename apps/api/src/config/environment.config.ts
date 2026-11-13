import path from 'node:path';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DB_HOST: z.string().min(1, 'DB_HOST is required'),
  DB_PORT: z.coerce.number().int().positive().default(5432),
  DB_USERNAME: z.string().min(1, 'DB_USERNAME is required'),
  DB_PASSWORD: z.string().min(1, 'DB_PASSWORD is required'),
  DB_NAME: z.string().min(1, 'DB_NAME is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  CUSTOMER_PORTAL_URL: z.string().min(1, 'CUSTOMER_PORTAL_URL is required'),
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),
  EMAIL_FROM: z.string().min(1, 'EMAIL_FROM is required'),
  ROBOFLOW_API_KEY: z.string().min(1).optional(),
  ROBOFLOW_WORKSPACE: z.string().min(1).optional(),
  ROBOFLOW_WORKFLOW_ID: z.string().min(1).optional(),
});

const env = EnvSchema.parse(process.env);

export const envConfig = Object.freeze({
  app: {
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    isDev: env.NODE_ENV === 'development',
    isProd: env.NODE_ENV === 'production',
    isTest: env.NODE_ENV === 'test',
  },
  db: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  },
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
  },
  clientUrls: {
    customerPortal: env.CUSTOMER_PORTAL_URL,
  },
  email: {
    resendApiKey: env.RESEND_API_KEY,
    from: env.EMAIL_FROM,
  },
  roboflow: {
    apiKey: env.ROBOFLOW_API_KEY ?? null,
    workspace: env.ROBOFLOW_WORKSPACE ?? null,
    workflowId: env.ROBOFLOW_WORKFLOW_ID ?? null,
  },
});
