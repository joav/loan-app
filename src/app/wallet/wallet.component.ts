import { Component, OnInit } from '@angular/core';
import { LoanService, sumTransaction } from '../loan.service';
import { loanFinalDate, LoanTransaction } from '../models/loan-transaction';
import { Transaction } from '../models/transaction';

@Component({
	selector: 'app-wallet',
	templateUrl: './wallet.component.html',
	styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
	gain = 0;
	borrowed = 0;
	funds = 0;

	constructor(public loanService:LoanService) {
		const loans = loanService.loans();
		this.gain = loanService.transactions.filter(t => t.type === 'Interes').reduce(sumTransaction, 0);
		this.borrowed = loans.filter(l => !l.closed).reduce((prev, curr) => prev + (+curr.value - +curr.capital),0);
		const initialFunds = loanService.transactions.filter(t => t.type === 'Directo').reduce(sumTransaction, 0);
		this.funds = initialFunds - this.borrowed;
	}

	ngOnInit(): void {
	}

	loanFinal(transaction: LoanTransaction){
		return loanFinalDate(transaction);
	}

}
