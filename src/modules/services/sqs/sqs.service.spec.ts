import { Test } from '@nestjs/testing';
import { SqsService } from './sqs.service';

jest.mock('squiss-ts', () => ({
  Squiss: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    start: jest.fn(),
    sendMessage: jest.fn(),
  })),
}));

describe('SqsService', () => {
  let sqsService: SqsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [SqsService],
    }).compile();

    sqsService = module.get<SqsService>(SqsService);
  });

  it('should be defined', () => {
    expect(sqsService).toBeDefined();
  });
});
