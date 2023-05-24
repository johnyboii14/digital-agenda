import apiUrl from '../constants/apiUrl';

const getAiringByIdGolang = async (setState: any, id: string | number) => {
  // unsure because of the routes in golang
  const urlToUse = `${apiUrl}/airings/${id}`;
  const data = await fetch(urlToUse);
  const json = await data.json();
  return setState(json.data[0]);
};

export default getAiringByIdGolang;
