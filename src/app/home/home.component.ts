import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RegisterComponent } from '../register/register.component';
import { Router, RouterLink } from '@angular/router';
import { AccountService } from '../services/account.service';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [
		MatButtonModule,
		MatIconButton,
		MatIconModule,
		RouterLink,
		RegisterComponent,
	],
	templateUrl: './home.component.html',
	styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
	registerMode = false;
	private router = inject(Router);
	private accountService = inject(AccountService);

	ngOnInit() {
		if (this.accountService.isLoggedIn()) {
			this.router.navigate(['/members']);
		}
	}

	registerToggle() {
		this.registerMode = !this.registerMode;
	}

	cancelRegisterMode(event: boolean) {
		this.registerMode = event;
	}
}
