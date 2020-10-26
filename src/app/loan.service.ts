import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Capital } from './models/capital';
import { Interest } from './models/interest';
import { Loan } from './models/loan';
import { loanFinalDate, LoanTransaction } from './models/loan-transaction';
import { Person } from './models/person';

import { Transaction } from "./models/transaction";
import { generateUID, getDate } from './utils';

@Injectable({
	providedIn: 'root'
})
export class LoanService {

	private _transactions: Transaction[];

	constructor(private firestore: AngularFirestore) {
		this.load();
	}

	add(transaction: Transaction) {
		this._transactions.unshift(transaction);
		this.save();
	}

	persons() {
		const persons = new Map<string, Person>();
		for (const transaction of this._transactions) {
			let person: Person = persons.get(transaction.who.toLowerCase());
			if(!person){
				person = {
					name: transaction.who,
					direct: 0,
					interests: 0,
					capital: 0,
					money: 0,
					loans: 0
				};
				persons.set(transaction.who, person);
			}
		}
		const loans = this.loans();
		for (const person of persons.values()) {
			person.direct = this._transactions.filter(t => t.type === 'Directo' && t.who === person.name).reduce(sumTransaction, 0);
			person.interests = this._transactions.filter(t => t.type === 'Interes' && t.who === person.name).reduce(sumTransaction, 0);
			const activeLoans = loans.filter(l => l.name === person.name && !l.closed);
			person.capital = activeLoans.reduce((prev, curr) => prev + curr.capital, 0);
			person.money = activeLoans.reduce((prev, curr) => prev + curr.value, 0) - person.capital;
			person.loans = loans.filter(l => l.name === person.name).length;
		}
		return Array.from(persons.values()).sort((a, b) => a.name === b.name?0:(a.name < b.name?-1:1));
	}

	loans() {
		const loans = new Map<string, Loan>();
		for (const transaction of (this._transactions as LoanTransaction[]).filter(t => t.type === 'Prestamo')) {
			let loan: Loan = loans.get(transaction.loanId);
			if(!loan){
				const capital = this._transactions.filter((t: Capital) => t.type === 'Capital' && t.loanId === transaction.loanId).reduce(sumTransaction, 0);
				const closed = capital >= transaction.value;
				loan = {
					id: transaction.loanId,
					name: transaction.who,
					value: transaction.value,
					interests: this._transactions.filter((t: Interest) => t.type === 'Interes' && t.loanId === transaction.loanId).reduce(sumTransaction, 0),
					monthlyInterest: transaction.loanValue,
					init: transaction.loanInit,
					final: loanFinalDate(
						transaction,
						closed,
						closed?(this._transactions.filter((t: Capital) => t.type === 'Capital' && t.loanId === transaction.loanId)[0] as Capital):null),
					capital,
					closed
				};
				loans.set(transaction.loanId, loan);
			}
		}
		return Array.from(loans.values()).sort((a, b) => a.closed === b.closed?0:(a.closed?1:-1));
	}

	sync(){
		return new Observable<string>(subs => {
			let id = localStorage.getItem('syncId');
			const syncData:any = {
				updatedOn: new Date()
			};
			if(!id){
				id = generateUID();
			}
			this.firestore.doc(`logs/${id}`).delete()
			.then(() => {
				this.firestore.doc(`logs/${id}`).set(syncData, {
					merge: true
				}).then(() => {
					const batch = this.firestore.firestore.batch();
					this._transactions.forEach((t, i) => {
						batch.set(this.firestore.doc(`logs/${id}`).collection('transactions').doc("t-"+i.toString().padStart(this.transactions.length.toString().length + 1, "0")).ref, t);
					});
					batch.commit()
					.then(() => {
						localStorage.setItem('syncId', id);
						subs.next(id);
						subs.complete();
					})
					.catch(e => {
						subs.error(e);
						subs.complete();
					});
				})
				.catch(e => {
					subs.error(e);
					subs.complete();
				});
			})
			.catch(e => {
				subs.error(e);
				subs.complete();
			});
		});
	}

	getSync(code: string) {
		return this.firestore.doc(`logs/${code.toLowerCase()}`).collection('transactions')
		.get()
		.pipe(
			map(r => r.docs.map(d => ({...d.data()} as Transaction))),
			map(r => {
				localStorage.setItem('syncId', code.toLowerCase());
				this._transactions = r;
				this.save();
			})
		)
	}

	get transactions() {
		return this._transactions;
	}

	get syncId(){
		return localStorage.getItem('syncId');
	}

	private load() {
		const transactionsData = localStorage.getItem('transactions') || '[]';
		this._transactions = JSON.parse(transactionsData);
	}

	private save() {
		localStorage.setItem('transactions', JSON.stringify(this._transactions));
	}
}

export const sumTransaction = (prev: number, curr: Transaction) => prev + curr.value;
