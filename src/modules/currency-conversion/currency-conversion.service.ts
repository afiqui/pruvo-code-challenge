import { Injectable, OnModuleInit } from '@nestjs/common';
import { ExchangeRatesService } from '../services/exchange-rates/exchange-rates.service';
import { GetCurrencyConversionDto } from './dto/get-currency-conversion.dto';
import { SqsService } from '../services/sqs/sqs.service';
import { Message, SQS } from 'squiss-ts';

@Injectable()
export class CurrencyConversionService implements OnModuleInit {
  constructor(
    private readonly exchangeRatesService: ExchangeRatesService,
    private readonly sqsService: SqsService,
  ) {}

  async onModuleInit() {
    this.sqsService.registerHandler(
      'getConversionResult',
      this.getConversionResultAndSendEmail.bind(this),
    );
  }

  convert(
    getCurrencyConversionDto: GetCurrencyConversionDto,
  ): Promise<SQS.SendMessageResult> {
    return this.sqsService.sendMessage(
      {
        name: 'getConversionResult',
      },
      0,
      {
        amount: getCurrencyConversionDto.amount,
        from: getCurrencyConversionDto.from,
        to: getCurrencyConversionDto.to,
        email: getCurrencyConversionDto.email,
      },
    );
  }

  async getConversionResultAndSendEmail(message: Message): Promise<any> {
    const { amount, from, to, email } = message.attributes as {
      amount: number;
      from: string;
      to: string;
      email: string;
    };
    const exchangeRates = this.exchangeRatesService.getExchangeRates;
    const rate = exchangeRates[to] / exchangeRates[from];

    const conversionResult = amount * rate;

    const emailTemplate = `
      <h1>Conversion Result</h1>
      <p>From: ${from}</p>
      <p>To: ${to}</p>
      <p>Amount: ${amount}</p>
      <p>Result: ${conversionResult.toLocaleString()}</p>
    `;
    await this.sendEmail(email, emailTemplate);
  }

  async sendEmail(email: string, message: string): Promise<any> {
    console.log('Sending email to: ', email);
    console.log('Message: ', message);
    return new Promise((resolve, _reject) => {
      resolve(message);
    });
  }
}
