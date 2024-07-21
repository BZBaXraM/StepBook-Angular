import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService, Login } from '../services/account.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
	selector: 'app-nav',
	standalone: true,
	imports: [
		FormsModule,
		BsDropdownModule,
		MatButtonModule,
		RouterLink,
		RouterLinkActive,
	],
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.css'],
})
export class NavComponent {
login() {
throw new Error('Method not implemented.');
}
	title = 'StepBook';
	// model: Login = { UsernameOrEmail: '', Password: '' };
	accountService = inject(AccountService);
	private router = inject(Router);

	// login() {
	// 	this.accountService.login(this.model).subscribe({
	// 		next: (_) => {
	// 			this.router.navigateByUrl('/members');
	// 		},
	// 		error: (error) => {
	// 			console.log(error);
	// 		},
	// 	});
	// }

	logout() {
		this.accountService.logout();
		this.router.navigateByUrl('/');
	}
}
