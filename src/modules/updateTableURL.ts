import baseUrl from '../constants/apiUrl';
function updateTableURL(
  url: string,
  day?: string,
  sortBy?: string,
  sortOrder?: string
): string {
  const updatedURL = new URL(url, baseUrl);

  if (day !== '' && day !== undefined) {
    updatedURL.searchParams.set('day', day);
  }

  if (sortBy !== '' && sortBy !== undefined) {
    updatedURL.searchParams.set('sort_by', sortBy);
  }

  if (sortOrder !== '' && sortOrder !== undefined) {
    updatedURL.searchParams.set('sort_order', sortOrder);
  }

  return updatedURL.search;
}

export default updateTableURL;
