import { Module, Global } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthController } from './health.controller';

@Global()
@Module({
  imports: [],
  controllers: [HealthController],
  providers: [HealthService],
  exports: [HealthService], // Export to another Module used
})
export class HealthModule {}
