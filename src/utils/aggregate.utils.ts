import { RawData } from '../interfaces';

export interface Aggregated {
  value: string | number;
  count: number;
}

export const aggregateFn = (agg: Aggregated[], data: RawData, field: string): void => {
  const value = data[field];
  const index = agg.findIndex((f) => f.value === value);
  if (index === -1) {
    agg.push({ value, count: 1 });
  } else {
    agg[index] = { ...agg[index], count: agg[index].count + 1 };
  }
};

export const sortAggregateFn = (a: Aggregated, b: Aggregated) => b.count - a.count;
