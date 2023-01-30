import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeRatesService } from './exchange-rates.service';

describe('ExchangeRatesService', () => {
  let service: ExchangeRatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExchangeRatesService],
    }).compile();

    service = module.get<ExchangeRatesService>(ExchangeRatesService);
  });

  it('should be called on moduleInit', () => {
    jest.spyOn(service, 'onModuleInit').mockResolvedValueOnce();
    service.onModuleInit();
    expect(service.onModuleInit).toHaveBeenCalled();
  });

  it('should be able to get daysLeft on apyCycle and requests remaining', async () => {
    jest.spyOn(service, 'getExchangeRateApiLimit').mockResolvedValueOnce({
      requestsRemaining: 1000,
      daysLeft: 1,
    });

    const result = await service.getExchangeRateApiLimit();
    expect(result).toEqual({
      requestsRemaining: 1000,
      daysLeft: 1,
    });
    expect(service.getExchangeRateApiLimit).toHaveBeenCalledTimes(1);
  });

  it('should be able to get exchange rates', async () => {
    jest.spyOn(service, 'getExchangeRatesFromApi').mockResolvedValueOnce({
      USD: 1,
      EUR: 0.9,
    });

    const result = await service.getExchangeRatesFromApi();
    expect(result).toEqual({
      USD: 1,
      EUR: 0.9,
    });
    expect(service.getExchangeRatesFromApi).toHaveBeenCalledTimes(1);
  });

  it('should be able to calc requests delay time', async () => {
    jest.spyOn(service, 'getExchangeRateApiLimit').mockResolvedValueOnce({
      requestsRemaining: 1000,
      daysLeft: 1,
    });
    jest.spyOn(service, 'calcRequestDelayTime');
    const result = await service.calcRequestDelayTime();
    expect(result).toBeGreaterThan(0);
    expect(service.calcRequestDelayTime).toHaveBeenCalledTimes(1);
    expect(service.getExchangeRateApiLimit).toHaveBeenCalledTimes(1);
  });
});
