import { SQS } from 'squiss-ts';
import { GetCurrencyConversionDto } from '../dto/get-currency-conversion.dto';

export interface ICurrencyConversionController {
  convert(
    getCurrencyConversionDto: GetCurrencyConversionDto,
  ): Promise<SQS.SendMessageResult>;
}
