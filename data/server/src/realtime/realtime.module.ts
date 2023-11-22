import { Module } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [RealtimeGateway],
  exports: [RealtimeGateway],
})
export class RealtimeModule {}
