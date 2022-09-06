import { ValueTransformer } from 'typeorm';
import { LocalDate } from '@js-joda/core';
import { DateTimeUtil } from '../common/date-time-util';

export class DateStringTransformer implements ValueTransformer {
  to(entityValue: LocalDate): string {
    return DateTimeUtil.toString(entityValue);
  }

  from(databaseValue: string): LocalDate {
    return DateTimeUtil.toLocalDateBy(databaseValue);
  }
}
