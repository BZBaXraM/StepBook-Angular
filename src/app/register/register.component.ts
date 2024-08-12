import { Component, OnInit, inject, output } from '@angular/core';
import {
	AbstractControl,
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	ValidatorFn,
	Validators,
} from '@angular/forms';
import { AccountService } from '../services/account.service';
import { TextInputComponent } from '../forms/text-input/text-input.component';
import { DatePickerComponent } from '../forms/date-picker/date-picker.component';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-register',
	standalone: true,
	templateUrl: './register.component.html',
	styleUrl: './register.component.css',
	imports: [
		ReactiveFormsModule,
		TextInputComponent,
		DatePickerComponent,
		MatButton,
		MatIcon,
	],
})
export class RegisterComponent implements OnInit {
	private accountService = inject(AccountService);
	private router = inject(Router);
	private toast = inject(ToastrService);
	cancelRegister = output<boolean>();
	registerForm: FormGroup = new FormGroup({
		Gender: new FormControl('Male'),
		Email: new FormControl('', [Validators.email, Validators.required]),
		Username: new FormControl('', Validators.required),
		KnownAs: new FormControl('', Validators.required),
		DateOfBirth: new FormControl('', Validators.required),
		City: new FormControl('', Validators.required),
		Country: new FormControl('', Validators.required),
		Password: new FormControl('', [
			Validators.required,
			Validators.minLength(8),
			Validators.maxLength(30),
		]),
		ConfirmPassword: new FormControl('', [
			Validators.required,
			this.matchValues('Password'),
		]),
	});
	maxDate = new Date();
	validationErrors: string[] | undefined;
	passwordFieldType = 'password';

	ngOnInit(): void {
		this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
	}

	matchValues(matchTo: string): ValidatorFn {
		return (control: AbstractControl) => {
			return control.value === control.parent?.get(matchTo)?.value
				? null
				: { isMatching: true };
		};
	}

	async register() {
		console.log(this.registerForm.value);
		const dob = this.getDateOnly(
			this.registerForm.get('DateOfBirth')?.value
		);
		this.registerForm.patchValue({ DateOfBirth: dob });
		this.accountService.register(this.registerForm.value).subscribe({
			next: (_) => {
				this.router
					.navigateByUrl('/confirmation-email-sent')
					.then((success) => {
						if (success) {
							this.toast.success(
								"You've successfully registered!"
							);
						} else {
							this.toast.error(
								'An error occurred while navigating to confirmation-email-sent'
							);
						}
					});
			},
			error: (error) => {
				this.validationErrors = error;
				this.toast.error(this.validationErrors!.toString());
			},
		});
	}

	cancel() {
		this.cancelRegister.emit(false);
	}

	private getDateOnly(dob: string) {
		if (!dob) return;
		return new Date(dob).toISOString().slice(0, 10);
	}

	togglePasswordVisibility() {
		this.passwordFieldType =
			this.passwordFieldType === 'password' ? 'text' : 'password';
	}
}
