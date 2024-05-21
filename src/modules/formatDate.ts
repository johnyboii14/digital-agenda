function formatDate(date: Date | string): string {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 as months are zero-indexed
  const day = dateObj.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default formatDate;
