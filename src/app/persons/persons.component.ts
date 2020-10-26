import { Component, OnInit } from '@angular/core';
import { LoanService } from '../loan.service';
import { Person } from '../models/person';

@Component({
	selector: 'app-persons',
	templateUrl: './persons.component.html',
	styleUrls: ['./persons.component.scss']
})
export class PersonsComponent implements OnInit {
	persons: Person[] = [];

	constructor(loanService:LoanService) {
		this.persons = loanService.persons();
	}

	ngOnInit(): void {
	}

}
