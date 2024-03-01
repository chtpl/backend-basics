import { Module } from '@nestjs/common';
import { ClubDataController } from './clubdata.controller';
import { ClubDataService } from './clubdata.service';

@Module({
  controllers: [ClubDataController],
  providers: [ClubDataService],
})
export class ClubDataModule {}
