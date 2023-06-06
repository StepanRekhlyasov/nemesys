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
