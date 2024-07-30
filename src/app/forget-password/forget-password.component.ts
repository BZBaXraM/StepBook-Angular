import {Component, inject} from '@angular/core';
import {AccountService} from "../services/account.service";
import {Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {MatInput} from "@angular/material/input";

@Component({
	selector: 'app-forget-password',
	standalone: true,
	imports: [RouterLink, FormsModule, NgIf, MatInput],
	templateUrl: './forget-password.component.html',
	styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent {
	private accountService = inject(AccountService);
	email = '';
	clientURI = 'https://localhost:7035/api/Account/reset-password';
	loading = false;
	success = false;
	private router = inject(Router);

	constructor() {
	}

	async forgetPassword() {
		this.loading = true;
		this.accountService.forgetPassword(this.email, this.clientURI).subscribe({
			next: (_) => {
				this.success = true;
				this.loading = false;
				this.router.navigateByUrl('/reset-password');
			},
			error: (_) => {
				this.loading = false;
			}
		});
	}

	reset() {
		this.loading = false;
		this.success = false;
	}

}
