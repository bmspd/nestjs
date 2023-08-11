export function AddPagination(
  target: unknown,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  if (typeof descriptor.value === 'function') {
    const original = descriptor.value;
    descriptor.value = async function (...args) {
      const result = await original.apply(this, args);
      const [payload] = args;
      const { pagination } = payload;
      const { page, per_page, total } = pagination;
      const last_page = Math.ceil(total / per_page);
      return {
        data: result,
        meta: { pagintaion: { page, per_page, total, last_page } },
      };
    };
  }
}
