export const round = (num: number, digit: number):number => {
  return Math.floor(num * Math.pow(10, digit)) / Math.pow(10, digit)
}

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
        row[key] =round(row['amount'] /num , digit)
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
