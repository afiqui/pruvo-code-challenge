import { DynamicModule, Module } from '@nestjs/common';
import { SqsService } from './sqs.service';

@Module({})
export class SqsModule {
  static register(): DynamicModule {
    return {
      module: SqsModule,
      providers: [SqsService],
      exports: [SqsService],
      global: true,
    };
  }
}
