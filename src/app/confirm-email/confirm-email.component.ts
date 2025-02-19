import { Component, inject } from '@angular/core';
import { AccountService } from '../services/account.service';
import {
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmCode } from '../models/confirm-code.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';

@Component({
	selector: 'app-confirm-email',
	standalone: true,
	imports: [
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		ReactiveFormsModule,
		NgIf,
	],
	templateUrl: './confirm-email.component.html',
	styleUrl: './confirm-email.component.css',
})
export class ConfirmEmailComponent {
	form: FormGroup;

	constructor(
		private accountService: AccountService,
		private formBuilder: FormBuilder,
		private router: Router
	) {
		this.form = this.formBuilder.group({
			code: ['', Validators.required],
		});
	}

	async confirmEmailCode() {
		this.accountService.confirmEmailCode(this.form.value).subscribe({
			next: (_) => {
				this.router.navigateByUrl('/login');
			},
			error: (error) => {
				console.error(`${JSON.stringify(error.error)}`);
			},
		});
	}
}
