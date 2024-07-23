import {Component, inject, signal} from '@angular/core';
import {AccountService, Login} from '../services/account.service';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {MatButtonModule} from '@angular/material/button';
import {ToastrService} from 'ngx-toastr';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [
		FormsModule,
		BsDropdownModule,
		MatInputModule,
		MatButtonModule,
		RouterLink,
	],
	templateUrl: './login.component.html',
	styleUrl: './login.component.css',
})
export class LoginComponent {
	protected model = signal<Login>({
		UsernameOrEmail: '',
		Password: '',
	});
	accountService = inject(AccountService);
	private router = inject(Router);
	private toast = inject(ToastrService);

	async login() {
		this.accountService.login(this.model()).subscribe({
			next: (_) => {
				this.toast.success('Logged in successfully');
				this.router.navigateByUrl('/members');
			},
			error: (error) => this.toast.error(`${JSON.stringify(error.error)}`),
		});
	}
}
