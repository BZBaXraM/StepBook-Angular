import { Component, inject } from '@angular/core';
import { AccountService, Login } from '../services/account.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [
		FormsModule,
		BsDropdownModule,
		MatInputModule,
		MatButtonModule,
		RouterLink,
	],
	templateUrl: './login.component.html',
	styleUrl: './login.component.css',
})
export class LoginComponent {
	title = 'StepBook';
	model: Login = { UsernameOrEmail: '', Password: '' };
	accountService = inject(AccountService);
	private router = inject(Router);

	login() {
		this.accountService.login(this.model).subscribe({
			next: (_) => {
				this.router.navigateByUrl('/members');
			},
			error: (error) => {
				console.log(error);
			},
		});
	}
}
