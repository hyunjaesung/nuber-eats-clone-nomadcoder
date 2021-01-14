import { UploadsController } from './uploads.controller';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [UploadsController],
})
export class UploadsModule {}
