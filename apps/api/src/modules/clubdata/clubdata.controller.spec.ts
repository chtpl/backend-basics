import { Test, TestingModule } from '@nestjs/testing';
import { ClubDataController } from './clubdata.controller';
import { ClubDataService } from './clubdata.service';

describe('ClubDataController', () => {
  let clubDataController: ClubDataController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ClubDataController],
      providers: [ClubDataService],
    }).compile();

    clubDataController = app.get<ClubDataController>(ClubDataController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(clubDataController.getClubData()).toBe('Hello World!');
    });
  });
});
