import { ClientFactory } from 'src/shared/model';
import { useClientFactory } from 'src/stores/clientFactory';
import { useBackOrder } from 'src/stores/backOrder';
const { getClientFactoryList } = useClientFactory();
const { countDaysByOfficeId } = useBackOrder();
const days = ['one', 'two', 'three', 'four', 'five'];
const route = ['coldCall', 'fax'];
const getDataListFromOfficeId = async (officeId: string, type: string) => {
  const dataList = await Promise.all(
    days.map(async (day) => {
      return await Promise.all(
        route.map(async (route) => {
          return await countDaysByOfficeId(officeId, day, route, type);
        })
      );
    })
  );
  return dataList;
};

const evaluator = (rows: number[][]) => {
  const totalPoints =
    rows[0][0] * 1 +
    rows[1][0] * 2 +
    rows[2][0] * 3 +
    rows[3][0] * 4 +
    rows[4][0] * 5 +
    rows[0][1] * 1.5 +
    rows[1][1] * 3 +
    rows[2][1] * 4.5 +
    rows[3][1] * 6 +
    rows[4][1] * 7.5;
  return totalPoints;
};

export const evaluateAll = async (
  clientFactory: ClientFactory,
  type: string
) => {
  let targetPoint = 0;
  const totalPoints: number[] = [];
  const clientfactoryList = await getClientFactoryList(clientFactory.clientID);
  for (const cf of clientfactoryList) {
    const totalPoint = evaluator(await getDataListFromOfficeId(cf.id, type));
    totalPoints.push(totalPoint);
    if (cf.id === clientFactory.id) {
      targetPoint = totalPoint;
    }
  }
  if (totalPoints.length === 0) return 'no data';
  const totalPointsAverage =
    totalPoints.reduce((acc, point) => {
      return acc + point;
    }, 0) / totalPoints.length;
  if (totalPointsAverage === 0) return 'no data';
  return Math.round((targetPoint / totalPointsAverage) * 100);
};
