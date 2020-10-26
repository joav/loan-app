import { Component, OnInit } from '@angular/core';
import { LoanService } from '../loan.service';
import { Loan } from '../models/loan';

@Component({
	selector: 'app-loans',
	templateUrl: './loans.component.html',
	styleUrls: ['./loans.component.scss']
})
export class LoansComponent implements OnInit {
	loans: Loan[] = [];
	loansTotal = 0;

	constructor(loanService: LoanService) {
		this.loans = loanService.loans();
		this.loansTotal = this.loans.filter(l => !l.closed).reduce((prev, curr) => prev + (+curr.value - +curr.capital),0);
	}

	ngOnInit(): void {
	}

}
