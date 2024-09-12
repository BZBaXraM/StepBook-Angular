import { Component, inject, signal } from '@angular/core';
import { AccountService } from '../services/account.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { ForgetPassword } from '../models/forget.password.model';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';

@Component({
	selector: 'app-forget-password',
	standalone: true,
	imports: [RouterLink, FormsModule, MatInput],
	templateUrl: './forget-password.component.html',
	styleUrl: './forget-password.component.css',
})
export class ForgetPasswordComponent {
	private accountService = inject(AccountService);
	private baseUrl = environment.apiUrl;
	model = signal<ForgetPassword>({
		email: '',
		clientURI: this.baseUrl + '/Account/reset-password',
	});
	loading = false;
	success = false;
	private toast = inject(ToastrService);

	async forgetPassword() {
		console.log('forgetPassword method called');
		this.loading = true;
		this.accountService.forgetPassword(this.model()).subscribe({
			next: (response) => {
				console.log('Password reset request successful:', response);
				this.success = true;
				this.toast.success(
					'Please check your email for password reset instructions'
				);
			},
			error: (error) => {
				console.error('Error occurred:', error);
				this.toast.error(`${JSON.stringify(error.error)}`);
				this.loading = false;
			},
		});
	}

	reset() {
		this.loading = false;
		this.success = false;
	}
}
