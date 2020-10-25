export interface Transaction {
	who: string;
	value: number;
	concept: string;
	date: string;
	type: TransactionType;
}

export type TransactionType = 'Directo'|'Interes'|'Prestamo'|'Capital';
