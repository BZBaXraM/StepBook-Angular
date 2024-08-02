import {Component, OnInit, OnDestroy, inject, output} from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	ValidatorFn,
	Validators
} from '@angular/forms';
import {AccountService} from '../services/account.service';
import {TextInputComponent} from "../forms/text-input/text-input.component";
import {DatePickerComponent} from '../forms/date-picker/date-picker.component';
import {Router} from '@angular/router';
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

@Component({
	selector: 'app-register',
	standalone: true,
	templateUrl: './register.component.html',
	styleUrl: './register.component.css',
	imports: [ReactiveFormsModule, TextInputComponent, DatePickerComponent, MatButton, MatIcon]
})
export class RegisterComponent implements OnInit, OnDestroy {
	private accountService = inject(AccountService);
	private fb = inject(FormBuilder);
	private router = inject(Router);
	cancelRegister = output<boolean>();
	registerForm = new FormGroup({
		Gender: new FormControl('Male'),
		Email: new FormControl('', [Validators.required, Validators.email]),
		Username: new FormControl('', Validators.required),
		KnownAs: new FormControl('', Validators.required),
		DateOfBirth: new FormControl('', Validators.required),
		City: new FormControl('', Validators.required),
		Country: new FormControl('', Validators.required),
		Password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]),
		ConfirmPassword: new FormControl('', [Validators.required, this.matchValues('Password')]),
	});
	maxDate = new Date();
	validationErrors: string[] | undefined;
	passwordFieldType = 'password';

	ngOnInit(): void {
		// this.initializeForm();
		this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
		this.loadFormData();
	}

	ngOnDestroy(): void {
		this.saveFormData();
	}

	// initializeForm() {
	// 	this.registerForm = this.fb.group({
	// 		Gender: ['Male'],
	// 		Email: ['', [Validators.required, Validators.email]],
	// 		Username: ['', Validators.required],
	// 		KnownAs: ['', Validators.required],
	// 		DateOfBirth: ['', Validators.required],
	// 		City: ['', Validators.required],
	// 		Country: ['', Validators.required],
	// 		Password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]],
	// 		ConfirmPassword: ['', [Validators.required, this.matchValues('Password')]],
	// 	});
	// 	this.registerForm.controls['Password'].valueChanges.subscribe({
	// 		next: () => this.registerForm.controls['ConfirmPassword'].updateValueAndValidity()
	// 	});
	// }

	matchValues(matchTo: string): ValidatorFn {
		return (control: AbstractControl) => {
			return control.value === control.parent?.get(matchTo)?.value ? null : {isMatching: true};
		};
	}

	register() {
		const dob = this.getDateOnly(this.registerForm.get('DateOfBirth')?.value);
		this.registerForm.patchValue({dateOfBirth: dob});
		this.accountService.register(this.registerForm.value).subscribe({
			next: _ => this.router.navigateByUrl('/login'),
			error: error => this.validationErrors = error
		});
	}

	cancel() {
		this.cancelRegister.emit(false);
	}

	private getDateOnly(dob: string | undefined) {
		if (!dob) return;
		return new Date(dob).toISOString().slice(0, 10);
	}

	togglePasswordVisibility() {
		this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
	}

	private saveFormData() {
		localStorage.setItem('registerFormData', JSON.stringify(this.registerForm.value));
	}

	private loadFormData() {
		const savedData = localStorage.getItem('registerFormData');
		if (savedData) {
			this.registerForm.patchValue(JSON.parse(savedData));
		}
	}
}
