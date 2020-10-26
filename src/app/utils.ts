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

export function generateUID() {
    // I generate the UID from two parts here
    // to ensure the random number provide enough bits.
    const firstPart = (Math.random() * 46656) | 0;
    const secondPart = (Math.random() * 46656) | 0;
    return ("000" + firstPart.toString(36)).slice(-3) + ("000" + secondPart.toString(36)).slice(-3);
}
