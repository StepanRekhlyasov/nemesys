export const calculateCVR = (input_list: number[]) => {
  const data_cvr = input_list.map((num, idx) => {
    if (idx == 0) return '100.0%';
    if (input_list[idx - 1] == 0) return '0.0%';
    const per = (input_list[idx] / input_list[idx - 1]) * 100;
    const per_str = per.toFixed(1);
    return per_str + '%';
  });
  return data_cvr;
};

export const convertToPercentage = (data: number[][]): number[][] => {
  const total = data.reduce((a, b) => a + b[0], 0);
  const percentage = data.map((row) => {
    if (total == 0) return [0];
    return [(row[0] / total) * 100];
  });
  return percentage;
};

export const calculateValues = (inputList: number[][]): string[][] => {
  const result: string[][] = [];
  for (let col = 0; col < inputList[0].length; col++) {
    const colSum: number = inputList.reduce((acc, sublist) => acc + sublist[col], 0);
    const calculatedSublist: string[] = inputList.map((sublist) => ((sublist[col] / colSum) * 100).toFixed(2) + '%');
    for(let row = 0; row < inputList.length; row++) {
      if (result[row] === undefined) result[row] = [];
      result[row][col] = calculatedSublist[row];
    }
  }
  return result;
}

export const getListFromObject = (
  objs: { [key: string]: string | number }[],
  targetList: Readonly<string[]>
) => {
  const itemList: (string | number)[] = [];
  for (const obj of objs) {
    for (const target of targetList) {
      if (target in obj) {
        itemList.push(obj[target]);
      }
    }
  }
  return itemList;
};


