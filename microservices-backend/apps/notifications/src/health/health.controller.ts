import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly microservice: MicroserviceHealthIndicator,
    private readonly configService: ConfigService,
  ) {}

  @Get('liveness')
  @HealthCheck()
  liveness() {
    return this.health.check([]);
  }

  @Get('readiness')
  @HealthCheck()
  readiness() {
    return this.health.check([
      () =>
        this.microservice.pingCheck('rabbitmq', {
          transport: Transport.RMQ,
          options: {
            urls: [this.configService.getOrThrow<string>('RABBITMQ_URL')],
          },
        }),
    ]);
  }
}
