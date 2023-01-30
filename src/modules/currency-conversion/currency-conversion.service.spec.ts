import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyConversionService } from './currency-conversion.service';
import { ExchangeRatesService } from '../services/exchange-rates/exchange-rates.service';
import { SqsService } from '../services/sqs/sqs.service';
import { Message } from 'squiss-ts';

describe('CurrencyConversionService', () => {
  let service: CurrencyConversionService;
  let sqsService: SqsService;
  let exchangeRatesService: ExchangeRatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CurrencyConversionService, ExchangeRatesService, SqsService],
    }).compile();

    service = module.get<CurrencyConversionService>(CurrencyConversionService);
    sqsService = module.get<SqsService>(SqsService);
    exchangeRatesService =
      module.get<ExchangeRatesService>(ExchangeRatesService);
  });

  it('should be called on moduleInit', () => {
    jest.spyOn(service, 'onModuleInit').mockResolvedValueOnce();
    service.onModuleInit();
    expect(service.onModuleInit).toHaveBeenCalled();
  });

  it('should be able to add request to sqs queue', async () => {
    jest.spyOn(sqsService, 'sendMessage').mockResolvedValueOnce({});
    const result = await service.convert({
      from: 'USD',
      to: 'EUR',
      amount: 100,
      email: 'test@test.com',
    });
    expect(result).toBeDefined();
    expect(sqsService.sendMessage).toHaveBeenCalledTimes(1);
  });

  it('should be able to handle message from queue and send email', async () => {
    jest
      .spyOn(exchangeRatesService, 'getExchangeRates', 'get')
      .mockReturnValueOnce({
        USD: 1,
        EUR: 0.9,
      });

    jest.spyOn(service, 'sendEmail');
    await service.getConversionResultAndSendEmail({
      attributes: {
        from: 'USD',
        to: 'EUR',
        amount: 100,
        email: 'test@gmail.com',
      },
    } as unknown as Message);
    expect(service).toBeDefined();
    expect(service.sendEmail).toHaveBeenCalledTimes(1);
  });
});
