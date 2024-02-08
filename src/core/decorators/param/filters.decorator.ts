import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Op } from 'sequelize';

export type FiltersRelation = Record<
  string,
  { fn: SeqHelperFunction; seqValue: string } | SeqHelperFunction
>;

export type SeqHelperFunction = (...args: unknown[]) => any;

export const Filters = createParamDecorator(
  (filtersRelation: FiltersRelation, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const { query } = req;
    return { [Op.and]: formFilters(query, filtersRelation) };
  },
);

export const formFilters = (values: any, filtersRelation: FiltersRelation) => {
  return Object.entries(filtersRelation).map(([field, value]) => {
    if (typeof value === 'function') return value(field, values);
    const { fn, seqValue } = value;
    return fn(field, values, seqValue);
  });
};
