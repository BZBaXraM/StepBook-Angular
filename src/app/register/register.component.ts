import { Component, inject, input, output } from '@angular/core';
import { Register } from '../types/register.model';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { AccountService } from '../services/account.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-register',
	standalone: true,
	imports: [FormsModule, MatInputModule, MatSelectModule, MatButtonModule],
	templateUrl: './register.component.html',
	styleUrl: './register.component.css',
})
export class RegisterComponent {
	model: Register = {
		Email: '',
		Username: '',
		KnownAs: '',
		Gender: '',
		DateOfBirth: '',
		City: '',
		Country: '',
		Password: '',
	};
	cancelRegister = output<boolean>();
	private accountService = inject(AccountService);
	private router = inject(Router);
	private toast = inject(ToastrService);

	register() {
		this.accountService.register(this.model).subscribe({
			next: (_) => {
				console.log('Registration successful');
			},
			error: (error) => {
				console.log(`Error registering: ${error}`);
			},
		});

		setTimeout(() => {
			this.toast.success(
				'Registration successful, please check your email for verification link.'
			);
		}, 700);
		this.router.navigateByUrl('/login');
	}

	cancel() {
		this.cancelRegister.emit(false);
		this.router.navigateByUrl('/');
	}
}
