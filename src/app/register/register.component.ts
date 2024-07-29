import {Component, inject, OnInit, output, signal} from "@angular/core";
import {Register} from "../models/register.model";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatButtonModule} from "@angular/material/button";
import {AccountService} from "../services/account.service";
import {Router} from "@angular/router";
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {MatIcon} from "@angular/material/icon";
import {JsonPipe} from "@angular/common";

@Component({
	selector: "app-register",
	standalone: true,
	imports: [
		ReactiveFormsModule,
		MatInputModule,
		MatSelectModule,
		MatButtonModule,
		MatIcon,
		JsonPipe,
	],
	templateUrl: "./register.component.html",
	styleUrl: "./register.component.css",
})
export class RegisterComponent implements OnInit {
	model = signal<Register>({
		Email: "",
		Username: "",
		KnownAs: "",
		Gender: "",
		DateOfBirth: Date.now().toString(),
		City: "",
		Country: "",
		Password: "",
	});
	cancelRegister = output<boolean>();
	private accountService = inject(AccountService);
	private router = inject(Router);
	private toast = inject(ToastrService);
	registerForm: FormGroup = new FormGroup({});

	ngOnInit(): void {
		this.initializeForm();
	}

	initializeForm() {
		this.registerForm = new FormGroup({
			Email: new FormControl("", [Validators.required, Validators.email]),
			Username: new FormControl("", Validators.required),
			KnownAs: new FormControl("", Validators.required),
			Gender: new FormControl("", Validators.required),
			DateOfBirth: new FormControl("", Validators.required),
			City: new FormControl("", Validators.required),
			Country: new FormControl("", Validators.required),
			Password: new FormControl("", [
				Validators.required,
				Validators.minLength(12),
				Validators.maxLength(20),
			]),
			ConfirmPassword: new FormControl("", this.matchValues("Password")),
		});
		this.registerForm.controls['Password'].valueChanges.subscribe({
			next: () => this.registerForm.controls['ConfirmPassword'].updateValueAndValidity()
		})
	}

	matchValues(matchTo: string): ValidatorFn {
		return (control: AbstractControl) => {
			return control.value === control.parent?.get(matchTo)?.value ? null : {isMatching: true}
		}
	}

	register() {
		console.log(this.registerForm.value);
		/*const dateOfBirthISO = new Date(this.model().DateOfBirth).toISOString();
		const modelWithCorrectedDate = {
			...this.model(),
			DateOfBirth: dateOfBirthISO,
		};

		this.accountService.register(modelWithCorrectedDate).subscribe({
			next: (_) => {
				console.log('Registered successfully');
				this.toast.success('Registration successful, please check your email for the verification link.');
				// this.router.navigateByUrl("/confirmation-email-sent");
			},
			error: (error) => {
				// console.log(error);
				this.toast.error(error.error);
			},
		});*/
	}

	cancel() {
		this.cancelRegister.emit(false);
	}

	private getDateOnly(dob: string | undefined) {
		if (!dob) return;
		return new Date(dob).toISOString().slice(0, 10);
	}
}
