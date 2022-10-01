import { Test, TestingModule } from '@nestjs/testing';
import { ClockifyService } from './clockify.service';

describe('ClockifyService', () => {
  let service: ClockifyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClockifyService],
    }).compile();

    service = module.get<ClockifyService>(ClockifyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
