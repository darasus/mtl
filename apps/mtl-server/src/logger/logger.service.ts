import { LoggerService } from '@nestjs/common';
import formats = require('dd-trace/ext/formats');
import { ddTracer } from '../trace';

export class Logger implements LoggerService {
  do(level, message) {
    const span = ddTracer.scope().active();
    const time = new Date().toISOString();
    const record = { time, level, message };

    if (span) {
      ddTracer.inject(span.context(), formats.LOG, record);
    }

    console.log(ddTracer.getRumData());

    console.log(JSON.stringify(record));
  }

  log(message: any, ...optionalParams: any[]) {
    this.do('info', message);
  }

  error(message: any, ...optionalParams: any[]) {
    this.do('error', message);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.do('warn', message);
  }

  debug?(message: any, ...optionalParams: any[]) {
    this.do('debug', message);
  }

  verbose?(message: any, ...optionalParams: any[]) {
    this.do('verbose', message);
  }
}
