import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { ValidationPipe } from '@nestjs/common';
import { Request, Response } from 'express';

const server = express();
let nestApp: any;
let isInitialized = false;

async function bootstrap() {
  nestApp = await NestFactory.create(AppModule, new ExpressAdapter(server));

  nestApp.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  nestApp.enableCors();
  await nestApp.init();
  isInitialized = true;
}

// Vercel's handler
export default async function handler(req: Request, res: Response) {
  if (!isInitialized) {
    await bootstrap();
  }
  return server(req, res);
}
