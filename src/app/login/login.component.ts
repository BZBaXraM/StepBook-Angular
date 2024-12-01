import { Component, inject, signal } from '@angular/core';
import { AccountService, Login } from '../services/account.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MatButtonModule } from '@angular/material/button';
import { ToastrService } from 'ngx-toastr';
import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatCardHeader } from '@angular/material/card';
import { NgIf } from '@angular/common';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [
		FormsModule,
		BsDropdownModule,
		MatInputModule,
		MatButtonModule,
		RouterLink,
		MatIcon,
		MatCardModule,
		MatCardHeader,
		NgIf,
	],
	templateUrl: './login.component.html',
	styleUrl: './login.component.css',
})
export class LoginComponent {
	model = signal<Login>({
		UsernameOrEmail: '',
		Password: '',
	});
	accountService = inject(AccountService);
	private router = inject(Router);
	private toast = inject(ToastrService);
	passwordFieldType = 'password';

	async login(form: NgForm) {
		// Проверка наличия пробелов в UsernameOrEmail
		if (this.hasWhitespace(this.model().UsernameOrEmail)) {
			this.toast.error('Username or email cannot contain spaces');
			return;
		}

		// Проверка валидности формы
		if (form.invalid) {
			return;
		}

		this.accountService.login(this.model()).subscribe({
			next: (_) => {
				this.toast.success('Logged in successfully');
				this.router.navigateByUrl('/members');
			},
			error: (error) =>
				this.toast.error(`${JSON.stringify(error.error)}`),
		});
	}

	// Метод для проверки наличия пробелов
	hasWhitespace(value: string): boolean {
		return /\s/.test(value);
	}

	togglePasswordVisibility() {
		this.passwordFieldType =
			this.passwordFieldType === 'password' ? 'text' : 'password';
	}
}
