import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { AccountService } from './services/account.service';
import { HomeComponent } from './home/home.component';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, NavComponent, HomeComponent],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
	private accountService = inject(AccountService);

	setCurrentUser() {
		const user = localStorage.getItem('user');
		if (!user) return;
		this.accountService.currentUser.set(JSON.parse(user));
	}

	ngOnInit(): void {
		this.setCurrentUser();
	}
}
