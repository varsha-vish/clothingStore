import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Sales Backend API is running!';
  }

  @Get('health')
  getHealth(): object {
    return {
      status: 'OK',
      message: 'Sales Backend API is healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Get('api')
  getApiInfo(): object {
    return {
      name: 'Sales Backend API',
      version: '1.0.0',
      description: 'NestJS backend for user and sales management',
      endpoints: {
        users: {
          signup: 'POST /api/users/signup',
          test: 'POST /api/users/test'
        },
        auth: {
          login: 'POST /api/auth/login',
          test: 'POST /api/auth/test'
        }
      }
    };
  }
}