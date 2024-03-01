import { Controller, Get } from '@nestjs/common';
import { ClubDataService } from './clubdata.service';

@Controller()
export class ClubDataController {
  constructor(private readonly clubDataService: ClubDataService) {}

  @Get()
  getClubData(): any {
    return this.clubDataService.getClubData();
  }
}
