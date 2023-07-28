function formatDateInPST(inputDate: string): string {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dateObj = new Date(inputDate);

  const day = dateObj.getUTCDate();
  const month = months[dateObj.getUTCMonth()];
  const year = dateObj.getUTCFullYear();
  const hour = dateObj.getUTCHours();
  const meridiem = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12;

  return `${month} ${day}, ${year} at ${hour12}${meridiem} PST`;
}

export default formatDateInPST;
