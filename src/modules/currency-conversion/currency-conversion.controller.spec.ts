import { Test } from '@nestjs/testing';
import { CurrencyConversionController } from './currency-conversion.controller';
import { CurrencyConversionService } from './currency-conversion.service';
import { ExchangeRatesService } from '../services/exchange-rates/exchange-rates.service';
import { SqsService } from '../services/sqs/sqs.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';

describe('CurrencyConversionController', () => {
  let currencyConversionController: CurrencyConversionController;
  let currencyConversionService: CurrencyConversionService;
  let app: INestApplication;

  class MockExchangeRatesService {
    getExchangeRates = jest.fn();
  }

  class MockSqsService {
    sendMessage = jest.fn();
  }

  class MockCurrencyConversionService {
    convert = jest.fn().mockImplementation(() => {
      return Promise.resolve({ MessageId: '123' });
    });
  }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [CurrencyConversionController],
      providers: [
        {
          provide: CurrencyConversionService,
          useClass: MockCurrencyConversionService,
        },
        { provide: ExchangeRatesService, useClass: MockExchangeRatesService },
        { provide: SqsService, useClass: MockSqsService },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    currencyConversionController = module.get<CurrencyConversionController>(
      CurrencyConversionController,
    );
  });

  it('should call currencyConversionService on conver with valid params ', async () => {
    const dto = {
      from: 'USD',
      to: 'EUR',
      amount: 100,
      email: 'test@gmail.com',
    };
    const response = await currencyConversionController.convert(dto);
    expect(response).toBeDefined();
    expect(response).toHaveProperty('MessageId');
  });
});
