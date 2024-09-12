import { Component, inject, signal } from '@angular/core';
import { AccountService } from '../services/account.service';
import { ChangePassword } from '../models/change-password.model';
import { ToastrService } from 'ngx-toastr';
import { ChangeUsername } from '../models/change-username.model';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
@Component({
	selector: 'app-account-settings',
	standalone: true,
	imports: [FormsModule, MatTabsModule],
	templateUrl: './account-settings.component.html',
	styleUrl: './account-settings.component.css',
})
export class AccountSettingsComponent {
	accountService = inject(AccountService);
	private router = inject(Router);
	toastr = inject(ToastrService);
	newUsername = signal<ChangeUsername>({
		newUsername: '',
	});

	newPassword = signal<ChangePassword>({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});

	changeUsername() {
		this.accountService.changeUsername(this.newUsername()).subscribe({
			next: (_) => {
				this.toastr.success('Username changed successfully');
			},
		});
	}

	changePassword() {
		this.accountService.changePassword(this.newPassword()).subscribe({
			next: (_) => {
				this.toastr.success('Password changed successfully');
			},
		});
	}

	deleteAccount() {
		this.accountService.deleteAccount().subscribe({
			next: (_) => {
				this.router.navigateByUrl('/login');
			},
		});
	}
}
