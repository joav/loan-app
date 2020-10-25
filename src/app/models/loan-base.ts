import { Transaction } from "./transaction";

export interface LoanBase extends Transaction {
	loanId: string;
}
