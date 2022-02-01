import { LoggerService } from '@nestjs/common';
import formats = require('dd-trace/ext/formats');
import { ddTracer } from '../trace';

export class Logger implements LoggerService {
  do(level: string, message: string) {
    const span = ddTracer.scope().active();
    const time = new Date().toISOString();
    const record = { time, level, message };

    if (span) {
      ddTracer.inject(span.context(), formats.LOG, record);
    }

    console.log(JSON.stringify(record));
  }

  log(message: string, ...optionalParams: any[]) {
    this.do('info', message);
  }

  error(message: string, ...optionalParams: any[]) {
    this.do('error', message);
  }

  warn(message: string, ...optionalParams: any[]) {
    this.do('warn', message);
  }

  debug?(message: string, ...optionalParams: any[]) {
    this.do('debug', message);
  }

  verbose?(message: string, ...optionalParams: any[]) {
    this.do('verbose', message);
  }
}
