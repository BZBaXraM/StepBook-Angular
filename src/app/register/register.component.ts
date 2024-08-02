import {
	Component,
	OnInit,
	OnDestroy,
	inject,
	output,
	signal,
} from '@angular/core';
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
export class RegisterComponent implements OnInit, OnDestroy {
	private accountService = inject(AccountService);
	private router = inject(Router);
	cancelRegister = output<boolean>();
	registerForm: FormGroup = new FormGroup({
		Gender: new FormControl('Male'),
		Email: new FormControl('', [Validators.required, Validators.email]),
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
	// validationErrors: string[] | undefined; // not working!
	validationErrors = signal<string[] | undefined>([]);
	passwordFieldType = 'password';

	ngOnInit(): void {
		this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
		this.loadFormData();
	}

	ngOnDestroy(): void {
		this.saveFormData();
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
			next: () => {
				// localStorage.removeItem('registerFormData'); // Clear form data on successful registration
				this.router.navigateByUrl('/login'); // Redirect to login page after successful registration not working, but registration is successful
			},
			error: (error) => this.validationErrors.set(error), // Display validation errors not working!
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

	private saveFormData() {
		const formData = this.registerForm.value;
		formData.DateOfBirth = this.getDateOnly(formData.DateOfBirth); // Ensure DateOfBirth is stored in correct format
		localStorage.setItem('registerFormData', JSON.stringify(formData));
	}

	private loadFormData() {
		const savedData = localStorage.getItem('registerFormData');
		if (savedData) {
			this.registerForm.patchValue(JSON.parse(savedData));
		}
	}
}
