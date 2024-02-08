import { Op } from 'sequelize';
const { substring, in: inValues, gte, lte } = Op;

const like = (
  field: string,
  values: Record<string, string>,
  seqField?: string,
) => {
  if (!values[field]) return {};
  return { [seqField ?? field]: { [substring]: values[field] } };
};

const inOptions = (
  field: string,
  values: Record<string, string>,
  seqField?: string,
) => {
  if (!values[field]) return {};
  try {
    return { [seqField ?? field]: { [inValues]: JSON.parse(values[field]) } };
  } catch (e) {
    return {};
  }
};

const dateFrom = (
  field: string,
  values: Record<string, string>,
  seqField?: string,
) => {
  if (!values[field]) return {};
  try {
    return {
      [seqField ?? field]: { [gte]: new Date(values[field]).setHours(0, 0, 0) },
    };
  } catch (e) {
    return {};
  }
};

const dateTo = (
  field: string,
  values: Record<string, string>,
  seqField?: string,
) => {
  if (!values[field]) return {};
  try {
    return {
      [seqField ?? field]: {
        [lte]: new Date(values[field]).setHours(23, 59, 59),
      },
    };
  } catch (e) {
    return {};
  }
};

export const seqHelpers = {
  like,
  in: inOptions,
  dateFrom,
  dateTo,
};
