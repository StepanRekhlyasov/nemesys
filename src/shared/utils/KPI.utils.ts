export const round = (num: number, digit: number): number => {
  return Math.floor(num * Math.pow(10, digit)) / Math.pow(10, digit);
};

export const convertToPercentage = (data: number[][]): number[][] => {
  const total = data.reduce((a, b) => a + b[0], 0);
  const percentage = data.map((row) => {
    if (total == 0) return [0];
    return [(row[0] / total) * 100];
  });
  return percentage;
};

export const devideByAmount = (rows, digit = 1) => {
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      const num = row[key];
      if (
        typeof num == 'number' &&
        typeof row['amount'] == 'number' &&
        num != 0 &&
        key != 'amount'
      ) {
        row[key] = round(row['amount'] / num, digit);
      }
    }
  }
  return [...rows];
};

export const convertObjToIdNameList = (objList) => {
  return objList.map((obj) => {
    return {
      value: obj.id,
      label: obj.name,
    };
  });
};

export const listToFixed = (arr: (number | string)[], fix = 2) => {
  return arr.map((num) => {
    if (typeof num === 'string') return num;
    return round(num, fix);
  });
};

