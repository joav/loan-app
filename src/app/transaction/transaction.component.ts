import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { LoanService } from '../loan.service';
import { LoanBase } from '../models/loan-base';
import { LoanTransaction } from '../models/loan-transaction';
import { Transaction } from '../models/transaction';
import { dateToString } from '../utils';

@Component({
	selector: 'app-transaction',
	templateUrl: './transaction.component.html',
	styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
	form: FormGroup;
	persons: string[] = [];
	filteredPersons: Observable<string[]>;
	loans: string[] = [];
	filteredLoans: Observable<string[]>;
	loanType:'percentage'|'value'|'' = 'percentage';

	constructor(private loanService: LoanService, private router: Router) {
		this.persons = loanService.persons().map(p => p.name);
		this.loans = loanService.loans().filter(l => !l.closed).map(l => l.id);
		this.form = new FormGroup({
			who: new FormControl('', [Validators.required]),
			value: new FormControl('', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]),
			concept: new FormControl(''),
			date: new FormControl(new Date(), [Validators.required]),
			type: new FormControl('', [Validators.required]),
			loanId: new FormControl(''),
			loanInit: new FormControl(new Date()),
			loanDuration: new FormControl('', [Validators.pattern(/^[1-9]\d* (dia|día|dias|mes|meses|año|años|ano|anos)$/)]),
			loanPercentage: new FormControl('3', [Validators.pattern(/^(100)$|^\d{1,2}(\.\d+)?$/)]),
			loanValue: new FormControl('', [Validators.pattern(/^\d+$/)]),
		});
		this.filteredPersons = this.who.valueChanges.pipe(
			startWith(''),
			map(value => this.filter(value, this.persons))
		);
		this.filteredLoans = this.loanId.valueChanges.pipe(
			startWith(''),
			map(value => this.filter(value, this.loans))
		);
		this.value.valueChanges.subscribe(value => {
			if(!this.value.hasError('pattern')){
				switch (this.loanType) {
					case 'value':
						this.loanPercentage.setValue(''+(+this.loanValue.value / +value * 100));
						break;

					case 'percentage':
						this.loanValue.setValue(''+(+value * +this.loanPercentage.value / 100));
						break;

					default:
						break;
				}
			}
		})
		this.loanPercentage.valueChanges.subscribe(percentage => {
			if(!this.loanPercentage.hasError('pattern') && ['', 'percentage'].includes(this.loanType)){
				if(percentage === ''){
					this.loanValue.setValue('');
					this.loanValue.enable();
					this.loanType = '';
				}else{
					this.loanType = 'percentage';
					this.loanValue.setValue(''+(+this.value.value * +percentage / 100));
					this.loanValue.disable();
				}
			}
		});
		this.loanValue.valueChanges.subscribe(value => {
			if(!this.loanValue.hasError('pattern') && ['', 'value'].includes(this.loanType)){
				if(value === ''){
					this.loanPercentage.setValue('');
					this.loanPercentage.enable();
					this.loanType = '';
				}else{
					this.loanType = 'value';
					this.loanPercentage.setValue(''+(+value / +this.value.value * 100));
					this.loanPercentage.disable();
				}
			}
		});
		this.loanValue.disable();
	}

	private filter(value: string, src: string[]): string[] {
		const filterValue = value.toLowerCase();

		return src.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
	}

	get who() {
		return this.form.get('who');
	}

	get value() {
		return this.form.get('value');
	}

	get concept() {
		return this.form.get('concept');
	}

	get date() {
		return this.form.get('date');
	}

	get type() {
		return this.form.get('type');
	}

	get loanId() {
		return this.form.get('loanId');
	}

	get loanInit() {
		return this.form.get('loanInit');
	}

	get loanDuration() {
		return this.form.get('loanDuration');
	}

	get loanPercentage() {
		return this.form.get('loanPercentage');
	}

	get loanValue() {
		return this.form.get('loanValue');
	}

	get isLoanType() {
		return ['Prestamo', 'Interes', 'Capital'].includes(this.type.value);
	}

	get isLoanTransaction() {
		return this.type.value === 'Prestamo';
	}

	ngOnInit(): void {
	}

	submit() {
		if(this.form.valid){
			let transaction: Transaction = {
				who: this.who.value,
				concept: this.concept.value,
				date: dateToString(this.date.value),
				type: this.type.value,
				value: +this.value.value
			};
			if(this.isLoanType){
				(transaction as LoanBase).loanId = this.loanId.value;
			}
			if(this.isLoanTransaction){
				transaction = {
					...transaction,
					loanInit: dateToString(this.loanInit.value),
					loanDuration: this.loanDuration.value,
					loanPercentage: +this.loanPercentage.value,
					loanValue: +this.loanValue.value
				} as LoanTransaction;
			}
			this.loanService.add(transaction);
			this.router.navigate(['/wallet']);
		}
	}

	typeChange(){
		if(this.isLoanType){
			this.loanId.setValidators([Validators.required]);
		}else{
			this.loanId.setErrors(null);
			this.loanId.clearValidators();
		}
		this.loanId.updateValueAndValidity();
		if(this.isLoanTransaction){
			this.loanInit.setValidators([Validators.required]);
		}else{
			this.loanInit.setErrors(null);
			this.loanInit.clearValidators();
		}
		this.loanInit.updateValueAndValidity();
	}

}
