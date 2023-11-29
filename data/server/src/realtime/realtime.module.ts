import { Module } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway';
import { RoomService } from './room.service';

@Module({
  imports: [],
  controllers: [],
  providers: [RealtimeGateway, RoomService],
  exports: [RealtimeGateway, RoomService],
})
export class RealtimeModule {}
