// noinspection JSUnusedGlobalSymbols

import { Transform } from 'class-transformer';
import { DateTimeUtil } from '../common/date-time-util';

export function ParseOptionalBoolean(): PropertyDecorator {
  return Transform(
    ({ value }) => {
      if (value === 'true') return true;
      if (value === 'false') return false;
      return value;
    },
    { toClassOnly: true },
  );
}

export function ParseLocalDateTime(): PropertyDecorator {
  return Transform(({ value }) => {
    return DateTimeUtil.toLocalDateTimeBy(value + '');
  });
}

export function ParseLocalDate(): PropertyDecorator {
  return Transform(({ value }) => {
    return DateTimeUtil.toLocalDateBy(value + '');
  });
}

export function ParseOptionalNumber(): PropertyDecorator {
  return Transform(({ value }) => {
    return +value;
  });
}
