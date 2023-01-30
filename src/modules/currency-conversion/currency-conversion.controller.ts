import { Body, Controller, Post } from '@nestjs/common';
import { GetCurrencyConversionDto } from './dto/get-currency-conversion.dto';
import { CurrencyConversionService } from './currency-conversion.service';
import { SQS } from 'squiss-ts';
import { ICurrencyConversionController } from './interfaces/controller.interface';

@Controller('/convert')
export class CurrencyConversionController
  implements ICurrencyConversionController
{
  constructor(
    private readonly currencyConversionService: CurrencyConversionService,
  ) {}
  @Post()
  convert(
    @Body() getCurrencyConversionDto: GetCurrencyConversionDto,
  ): Promise<SQS.SendMessageResult> {
    return this.currencyConversionService.convert(getCurrencyConversionDto);
  }
}
