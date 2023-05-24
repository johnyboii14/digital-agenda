import { getAiring } from '../actions/airings';
import { Airing } from '../@types';

async function getAiringFromParams(id: string | number, dispatch: Function) {
  const { payload } = await dispatch(getAiring(id));
  const retrievedAiring: Airing = payload.data[0] as Airing;
  return retrievedAiring;
}

export default getAiringFromParams;
