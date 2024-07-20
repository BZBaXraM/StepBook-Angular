import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavComponent } from '../shared/nav/nav.component';
import { AccountService } from './services/account.service';
import { Member } from './types/member.model';
import { HomeComponent } from "./home/home.component";

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, NavComponent, HomeComponent],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
	users = signal<Member[]>([]);
	title = 'stepbook-app';
	private http = inject(HttpClient);
	private accountService = inject(AccountService);

	setCurrentUser() {
		const user = localStorage.getItem('user');
		if (!user) return;
		this.accountService.currentUser.set(JSON.parse(user));
	}

	getUsers() {
		this.http
			.get<Member[]>('https://localhost:7035/api/users?gender=male')
			.subscribe((data) => {
				this.users = signal(data);
			});
	}

	ngOnInit(): void {
		this.getUsers();
		this.setCurrentUser();
	}
}
