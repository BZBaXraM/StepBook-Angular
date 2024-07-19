import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService, Login } from '../../app/services/account.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@Component({
	selector: 'app-nav',
	standalone: true,
	imports: [FormsModule, BsDropdownModule],
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.css'],
})
export class NavComponent {
	title = 'Stepbook';
	model: Login = { UsernameOrEmail: '', Password: '' };
	private readonly accountService = inject(AccountService);
	loggedIn = false;

	login() {
		this.accountService.login(this.model).subscribe({
			next: (response) => {
				console.log(response);
				this.loggedIn = true;
			},
			error: (error) => {
				console.log(error);
			},
		});
	}

	logout() {
		this.loggedIn = false;
	}
}
