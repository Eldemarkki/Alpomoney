export const sumBy = <T>(arr: T[], getValue: (item: T) => number) => arr.reduce((acc, curr) => acc + getValue(curr), 0);

export const groupBy = <T>(arr: T[], getKey: (item: T) => string) => arr.reduce<Record<string, T[]>>((acc, curr) => {
  const key = getKey(curr);
  if (!acc[key]) {
    acc[key] = [];
  }
  acc[key].push(curr);
  return acc;
}, {});
