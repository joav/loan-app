import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoansComponent } from './loans/loans.component';
import { PersonsComponent } from './persons/persons.component';
import { TransactionComponent } from './transaction/transaction.component';
import { WalletComponent } from './wallet/wallet.component';

const routes: Routes = [
	{
		path: '',
		component: HomeComponent
	},
	{
		path: 'wallet',
		component: WalletComponent
	},
	{
		path: 'transaction',
		component: TransactionComponent
	},
	{
		path: 'persons',
		component: PersonsComponent
	},
	{
		path: 'loans',
		component: LoansComponent
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
