import { LocalDateTime } from '@js-joda/core';
import { FindOperator, ValueTransformer } from 'typeorm';
import { DateTimeUtil } from '../common/date-time-util';

export class LocalDatetimeTransformer implements ValueTransformer {
  to(
    entityValue: LocalDateTime | FindOperator<LocalDateTime>,
  ): Date | FindOperator<any> {
    if (entityValue === undefined) {
      return undefined;
    }
    if (entityValue instanceof FindOperator) {
      return new FindOperator(
        entityValue.type,
        Array.isArray(entityValue.value)
          ? entityValue.value.map((value) => DateTimeUtil.toDate(value))
          : DateTimeUtil.toDate(entityValue.value),
        entityValue.useParameter,
        entityValue.multipleParameters,
      );
    }
    return DateTimeUtil.toDate(entityValue);
  }

  from(databaseValue: Date): LocalDateTime {
    if (databaseValue instanceof LocalDateTime) {
      return databaseValue;
    }
    return DateTimeUtil.toLocalDateTime(databaseValue);
  }
}
