import { Controller, Get, Header } from '@nestjs/common';
import { register, collectDefaultMetrics } from 'prom-client';

// Enable default Node.js/Nest metrics (once per process)
collectDefaultMetrics();

@Controller('metrics')
export class MetricsController {
  @Get()
  @Header('Content-Type', register.contentType)
  async getMetrics(): Promise<string> {
    return await register.metrics();
  }
}
