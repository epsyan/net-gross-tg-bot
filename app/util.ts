export const parseNumberFromMessage = (message: string): number | false => {
  const parsedNumber = parseFloat(message.match(/\d+/)?.[0] ?? "");

  return parsedNumber && !isNaN(parsedNumber) ? parsedNumber : false;
};

export const toUsd = (num: number) =>
  num.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  });

export const arrToUsd = (...arr: number[]): string[] => arr.map(toUsd);
