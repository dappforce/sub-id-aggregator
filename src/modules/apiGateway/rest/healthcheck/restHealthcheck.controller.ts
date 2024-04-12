import { Controller, Get, UseFilters, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ThrottlerExceptionFilter } from 'src/common/filters/throttler-exception.filter';

@UseFilters(ThrottlerExceptionFilter)
@Controller('healthcheck')
export class RestHealthcheckController {
  @Get('status')
  @UseGuards(ThrottlerGuard)
  status(): { operational: boolean } {
    return { operational: true };
  }
}
