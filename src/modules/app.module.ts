import { Module } from '@nestjs/common';
import { CurrencyConversionModule } from './currency-conversion/currency-conversion.module';
import { SqsModule } from './services/sqs/sqs.module';

@Module({
  imports: [CurrencyConversionModule, SqsModule.register()],
  controllers: [],
  providers: [],
})
export class AppModule {}
