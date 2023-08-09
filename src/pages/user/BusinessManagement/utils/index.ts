import { DispatchIndexTable } from '../types/index'

export const evaluator = (rows: DispatchIndexTable[]) => {
  for (const row of rows) {
    const totalPoints =
      row.telOne * 1 +
      row.telTwo * 2 +
      row.telThree * 3 +
      row.telFour * 4 +
      row.telFive * 5 +
      row.faxOne * 1.5 +
      row.faxTwo * 3 +
      row.faxThree * 4.5 +
      row.faxFour * 6 +
      row.faxFive * 7.5;
    row.totalPoints = totalPoints;
  }
  const totalPointsAverage =
    rows.reduce((acc, row) => {
      return acc + (row.totalPoints as number);
    }, 0) / rows.length;

  for (const row of rows) {
    row.index = Math.round(
      ((row.totalPoints as number) / totalPointsAverage) * 100
    );
  }
  return rows;
};
