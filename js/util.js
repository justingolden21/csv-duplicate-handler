function getFormattedDate() {
	let today = new Date();
	let day = today.getDate();
	let mon = today.getMonth() + 1; // Jan is 0
	day = day < 10 ? '0' + day : day;
	mon = mon < 10 ? '0' + mon : mon;
	return mon + '_' + day + '_' + today.getFullYear();	
}

// export { getFormattedDate };