enum Month {
	ene,
	feb,
	mar,
	abr,
	may,
	jun,
	jul,
	ago,
	sep,
	oct,
	nov,
	dic
}

const monthIndex = [
	'ene',
	'feb',
	'mar',
	'abr',
	'may',
	'jun',
	'jul',
	'ago',
	'sep',
	'oct',
	'nov',
	'dic'
];

export function dateToString(date: Date) {
	return `${date.getDate()}-${monthIndex[date.getMonth()]}-${date.getFullYear()}`;
}

export function getDate(date: string) {
	const [day, monthStr, year] = date.split('-');
	return new Date(+year, Month[monthStr], +day);
}
