function turnValToLocalePrice(val: string | number): string {
	return parseInt(val.toLocaleString(), 10).toLocaleString('en-US');
}

export default turnValToLocalePrice;
