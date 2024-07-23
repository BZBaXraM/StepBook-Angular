import {Component, inject, output, signal} from '@angular/core';
import {Register} from '../types/register.model';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {AccountService} from '../services/account.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {MatIcon} from "@angular/material/icon";

@Component({
	selector: 'app-register',
	standalone: true,
	imports: [FormsModule, MatInputModule, MatSelectModule, MatButtonModule, MatIcon],
	templateUrl: './register.component.html',
	styleUrl: './register.component.css',
})
export class RegisterComponent {
	protected model = signal<Register>({
		Email: '',
		Username: '',
		KnownAs: '',
		Gender: '',
		DateOfBirth: Date.now().toString(),
		City: '',
		Country: '',
		Password: ''
	});
	cancelRegister = output<boolean>();
	private accountService = inject(AccountService);
	private router = inject(Router);
	private toast = inject(ToastrService);

	async register() {
		const dateOfBirthISO = new Date(this.model().DateOfBirth).toISOString();
		const modelWithCorrectedDate = {
			...this.model(),
			DateOfBirth: dateOfBirthISO
		};

		this.accountService.register(modelWithCorrectedDate).subscribe({
			next: (_) => {
				// console.log('Registered successfully');
				// this.toast.success('Registration successful, please check your email for the verification link.');
				this.router.navigateByUrl('/confirmation-email-sent');
			},
			// complete: async () => {
			//	await this.router.navigateByUrl('/confirmation-email-sent');
			// }
		});
	}


	cancel() {
		this.cancelRegister.emit(false);
	}
}
