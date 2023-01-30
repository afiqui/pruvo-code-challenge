import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import * as moment from 'moment';
import axios from 'axios';

@Injectable()
export class ExchangeRatesService implements OnModuleInit {
  private exchangeRates: { [key: string]: number } = {};
  private static readonly MAX_INSTANCES = 3;

  async onModuleInit() {
    this.exchangeRates = await this.getExchangeRatesFromApi();

    const delayTime = await this.calcRequestDelayTime();

    setInterval(async () => {
      this.exchangeRates = await this.getExchangeRatesFromApi();
    }, delayTime);
  }

  async calcRequestDelayTime(): Promise<number> {
    const exchangeRateApiLimit = await this.getExchangeRateApiLimit();

    if (
      !exchangeRateApiLimit.requestsRemaining ||
      exchangeRateApiLimit.requestsRemaining < 1
    ) {
      throw new InternalServerErrorException(
        `No requests remaining for exchange rate API`,
      );
    }

    const now = moment();
    const endOfCycle = moment().add(exchangeRateApiLimit.daysLeft, 'days');
    const diffInSec = endOfCycle.diff(now, 'seconds');

    const delayTime =
      ((diffInSec * ExchangeRatesService.MAX_INSTANCES) /
        exchangeRateApiLimit.requestsRemaining) *
      1000;

    return delayTime;
  }

  get getExchangeRates(): { [key: string]: number } {
    return this.exchangeRates;
  }

  async getExchangeRatesFromApi(): Promise<{ [key: string]: number }> {
    try {
      const response = await axios.get(
        `https://openexchangerates.org/api/latest.json?app_id=${process.env.OPEN_RATES_APP_ID}`,
      );
      return response.data.rates;
    } catch (error) {
      throw new InternalServerErrorException(
        `Could not retrieve exchange rates: ${error.message}`,
      );
    }
  }

  async getExchangeRateApiLimit(): Promise<{
    daysLeft: number;
    requestsRemaining: number;
  }> {
    try {
      const response = await axios.get(
        `https://openexchangerates.org/api/usage.json?app_id=${process.env.OPEN_RATES_APP_ID}`,
      );
      return {
        daysLeft: response.data.data.usage.days_remaining,
        requestsRemaining: response.data.data.usage.requests_remaining,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Could not retrieve exchange rates: ${error.message}`,
      );
    }
  }
}
