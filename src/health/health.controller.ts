import { Controller, Get } from '@nestjs/common';
import mongoose from 'mongoose';

@Controller('health')
export class HealthController {
  @Get()
  getHealth() {
    const mongo = mongoose.connection?.readyState;
    const mongoStatus =
      mongo === 1 ? 'up' : mongo === 2 ? 'connecting' : mongo === 0 ? 'down' : 'unknown';
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      checks: {
        mongodb: mongoStatus,
      },
    };
  }
}
