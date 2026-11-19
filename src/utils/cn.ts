type ClassValue = false | null | string | undefined;

export const cn = (...values: ClassValue[]) =>
  values.filter((value): value is string => Boolean(value)).join(" ");
