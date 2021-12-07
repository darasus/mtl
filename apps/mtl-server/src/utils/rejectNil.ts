import * as R from 'ramda';

export const rejectNil = <T>(value: T | null | undefined) =>
  R.reject(R.isNil)(value);
