import { Injectable, Logger } from '@nestjs/common';
import { ILogger } from '../../domain/logger/logger.interface';
import { EnvironmentConfigService } from '../config/environment-config/environment-config.service';

@Injectable()
export class LoggerService extends Logger implements ILogger {
  constructor(private readonly config: EnvironmentConfigService) {
    super();
  }

  public debug(context: string, message: string) {
    if (this.config.getEnvironment() === 'development') {
      super.debug(`[DEBUG] ${message}`, context);
    }
  }

  public log(context: string, message: string) {
    super.log(`[INFO] ${message}`, context);
  }

  public error(context: string, message: string, trace?: string) {
    super.error(`[ERROR] ${message}`, trace, context);
  }

  public warn(context: string, message: string) {
    super.warn(`[WARN] ${message}`, context);
  }

  public verbose(context: string, message: string) {
    if (this.config.getEnvironment() === 'development') {
      super.verbose(`[VERBOSE] ${message}`, context);
    }
  }
}
