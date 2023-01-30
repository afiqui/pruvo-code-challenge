import { Injectable, OnModuleInit } from '@nestjs/common';
import { Squiss, IMessageToSend, IMessageAttributes, Message } from 'squiss-ts';

@Injectable()
export class SqsService implements OnModuleInit {
  private sqs: Squiss;
  private sqsHandlerList: { [x: string]: (message: Message) => void } = {};
  async onModuleInit() {
    const awsConfig = {
      accessKeyId: 'dummy',
      secretAccessKey: 'dummy',
      region: 'dummy',
      endpoint: 'http://localhost:9324',
    };

    this.sqs = new Squiss({
      awsConfig,
      queueName: 'default',
      bodyFormat: 'json',
      maxInFlight: 15,
    });

    this.sqs.on('message', (message: Message) => {
      const { name } = message.body;
      const handler = this.sqsHandlerList[name];
      if (handler) {
        handler(message);
      }
      message.del();
    });
    await this.sqs.start();
  }

  sendMessage(
    message: IMessageToSend,
    delay: number,
    props: IMessageAttributes,
  ) {
    return this.sqs.sendMessage(message, delay, props);
  }

  registerHandler(queueName: string, handler: (message: Message) => void) {
    this.sqsHandlerList[queueName] = handler;
  }
}
