import { Module } from '@nestjs/common';
import { ClubDataModule } from './modules/clubdata/clubdata.module';

@Module({
  imports: [ClubDataModule],
})
export class AppModule {}
