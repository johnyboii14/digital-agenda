function addSubtractDay(dateString: string, days: number): string {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 as months are zero-indexed
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default addSubtractDay;
