import { Test, TestingModule } from '@nestjs/testing';
import { ExampleController } from './app.controller';
import { AppService } from './example.service';

describe('ExampleController', () => {
  let exampleController: ExampleController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ExampleController],
      providers: [AppService],
    }).compile();

    exampleController = app.get<ExampleController>(ExampleController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(exampleController.getHello()).toBe('Hello World!');
    });
  });
});
