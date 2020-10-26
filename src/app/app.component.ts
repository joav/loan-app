import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'loan-app';
	constructor(auth: AngularFireAuth){
		auth.signInAnonymously()
		.then(u => u)
		.catch(e => e);
	}
}
