function turnValToLocalePrice(val: string | number): string {
  return parseInt(val.toLocaleString() as string, 10).toLocaleString("en-US");
}

export default turnValToLocalePrice;
