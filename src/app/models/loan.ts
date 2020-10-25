export interface Loan {
	id: string;
	name: string;
	value: number;
	interests: number;
	monthlyInterest: number;
	init: string;
	final: string;
	capital: number;
	closed: boolean;
}
