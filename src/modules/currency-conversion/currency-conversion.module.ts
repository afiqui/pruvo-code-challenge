import { ExchangeRatesService } from '../services/exchange-rates/exchange-rates.service';
import { CurrencyConversionController } from './currency-conversion.controller';
import { Module } from '@nestjs/common';
import { CurrencyConversionService } from './currency-conversion.service';

@Module({
  imports: [],
  controllers: [CurrencyConversionController],
  providers: [CurrencyConversionService, ExchangeRatesService],
})
export class CurrencyConversionModule {}
