import { seqHelpers } from '../utils/seqHelpers';

export const TASKS_FILTERS = {
  title: seqHelpers.like,
  status: seqHelpers.in,
  priority: seqHelpers.in,
  created_from: { fn: seqHelpers.dateFrom, seqValue: 'createdAt' },
  created_to: { fn: seqHelpers.dateTo, seqValue: 'createdAt' },
  executor: { fn: seqHelpers.in, seqValue: 'executor_id' },
  creator: { fn: seqHelpers.in, seqValue: 'creator_id' },
};
