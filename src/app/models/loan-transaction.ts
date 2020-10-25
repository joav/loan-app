import { dateToString, getDate } from "../utils";
import { Capital } from "./capital";
import { LoanBase } from "./loan-base";

const multipliers = {
	'dias': 86400000,
	'día': 86400000,
	'dia': 86400000,
	'mes': 2592000000,
	'meses': 2592000000,
	'año': 31536000000,
	'ano': 31536000000,
	'años': 31536000000,
	'anos': 31536000000,
}

export interface LoanTransaction extends LoanBase {
	loanInit: string;
	loanDuration: string;
	loanPercentage: number;
	loanValue: number;
}

export function loanFinalDate(transaction: LoanTransaction, closed = false, lastCapital: Capital = null){
	if(closed){
		return lastCapital.date;
	}else{
		if(transaction.loanDuration && transaction.loanDuration == '') return '';
		const initDate = getDate(transaction.loanInit);
		const [times, type] = transaction.loanDuration.split(' ');
		return `${dateToString(new Date(initDate.getTime() + +times * multipliers[type]))} (${transaction.loanDuration})`;
	}
}
