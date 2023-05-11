function cleanUpString(s: string): string {
  const pattern = /"([^"]*[^"])"/g;

  // Replace each matched string with its contents, without the extra quotes
  let cleanedStr = s.replace(pattern, "$1");
  cleanedStr = cleanedStr.replace(/[\u0000-\u001F\u007F]/g, "");
  return cleanedStr;
}

export default cleanUpString;
