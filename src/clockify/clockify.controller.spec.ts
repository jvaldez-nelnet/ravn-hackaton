import { Test, TestingModule } from '@nestjs/testing';
import { ClockifyController } from './clockify.controller';

describe('ClockifyController', () => {
  let controller: ClockifyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClockifyController],
    }).compile();

    controller = module.get<ClockifyController>(ClockifyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
