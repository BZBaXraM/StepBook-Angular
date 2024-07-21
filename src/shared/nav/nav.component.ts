import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService, Login } from '../../app/services/account.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import {MatButtonModule} from '@angular/material/button';


@Component({
	selector: 'app-nav',
	standalone: true,
	imports: [FormsModule, BsDropdownModule, MatButtonModule],
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.css'],
})
export class NavComponent {
	title = 'StepBook';
	model: Login = { UsernameOrEmail: '', Password: '' };
	accountService = inject(AccountService);
	login() {
		this.accountService.login(this.model).subscribe({
			next: (response) => {
				console.log(response);
			},
			error: (error) => {
				console.log(error);
			},
		});
	}

	logout() {
		this.accountService.logout();
	}
}
