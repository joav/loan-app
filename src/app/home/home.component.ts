import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { LoanService } from '../loan.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	hasData = false;
	sync = false;
	syncId: string;

	constructor(private loanService: LoanService, private snackbar: MatSnackBar, private dialog: MatDialog) {
		this.hasData = loanService.transactions.length > 0;
		this.syncId = loanService.syncId;
	}

	ngOnInit(): void {
	}

	doSync() {
		this.sync = true;
		this.loanService.sync().subscribe(id => {
			this.syncId = id;
			this.sync = false;
			this.snackbar.open("Sincronización finalizada", null, {
				duration: 2000
			})
		}, e => {
			console.log(e);
			this.syncId = null;
			this.sync = false;
		});
	}

	syncCode() {
		const dialogRef = this.dialog.open(CodeComponent, {
			width: '450px',
		});

		dialogRef.afterClosed().subscribe(result => {
			if(result && result.length){
				this.sync = true;
				this.loanService.getSync(result)
				.subscribe(()=>{
					this.syncId = result;
					this.sync = false;
					this.snackbar.open("Sincronización finalizada", null, {
						duration: 2000
					});
					this.hasData = true;
				}, e => {
					console.log(e);
					this.syncId = null;
					this.sync = false;
				})
			}
		});
	}

}

@Component({
	selector: 'app-code',
	template: `<h1 mat-dialog-title>Nuevo Código de sincronización</h1>
	<div mat-dialog-content>
	  <mat-form-field>
		<mat-label>Código</mat-label>
		<input matInput [(ngModel)]="code">
	  </mat-form-field>
	</div>
	<div mat-dialog-actions>
	  <button mat-raised-button color="warn" (click)="close()">Cerrar</button>
	  <br>
	  <button mat-raised-button color="primary" [mat-dialog-close]="code" cdkFocusInitial>Sincronizar</button>
	</div>`
})
export class CodeComponent {
	code: string = '';
	constructor(public dialogRef: MatDialogRef<CodeComponent>) { }
	close() {
		this.dialogRef.close();
	}
}
