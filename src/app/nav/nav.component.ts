import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
	selector: 'app-nav',
	standalone: true,
	imports: [
		FormsModule,
		BsDropdownModule,
		MatButtonModule,
		RouterLink,
		RouterLinkActive,
	],
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.css'],
})
export class NavComponent {
	title = 'StepBook';
	accountService = inject(AccountService);
	private router = inject(Router);

	logout() {
		this.accountService.logout();
		this.router.navigateByUrl('/');
	}
}
