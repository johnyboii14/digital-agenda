function replaceDateInQueryString(
  queryString: string,
  newDate: string
): string {
  const regex = /(\?day=)(\d{4}-\d{2}-\d{2})(.*)/;
  return queryString.replace(regex, '$1' + newDate + '$3');
}

export default replaceDateInQueryString;
