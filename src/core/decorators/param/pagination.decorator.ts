import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CustomBadRequestExceptions } from 'src/core/exceptions/CustomBadRequestExceptions';
export type TSeqPagination = {
  limit: number;
  offset: number;
  page: number;
  per_page: number;
  total?: number;
};
export const Pagination = createParamDecorator(
  (data, context: ExecutionContext): TSeqPagination => {
    const req = context.switchToHttp().getRequest();
    const { query } = req;
    const page = parseInt(query?.page);
    const per_page = parseInt(query?.per_page);
    if (isNaN(page) || isNaN(per_page) || page < 1 || per_page < 1)
      throw new CustomBadRequestExceptions({
        pagination: 'Insert valid pagination params',
      });
    return { offset: (page - 1) * per_page, limit: per_page, page, per_page };
  },
);
