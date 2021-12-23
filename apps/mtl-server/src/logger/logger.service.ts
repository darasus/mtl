import { LoggerService } from '@nestjs/common';
import tracer from 'dd-trace';
import formats = require('dd-trace/ext/formats');

export class Logger implements LoggerService {
  do(level, message) {
    const span = tracer.scope().active();
    const time = new Date().toISOString();
    const record = { time, level, message };

    if (span) {
      tracer.inject(span.context(), formats.LOG, record);
    }

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
