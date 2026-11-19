export const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/u)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .filter(Boolean)
    .join("")
    .toUpperCase();
