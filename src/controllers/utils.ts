export const parseId = (raw: string | string[] | undefined): number | null => {
  if (typeof raw !== "string") {
    return null;
  }
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
};