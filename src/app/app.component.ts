import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavComponent } from '../shared/nav/nav.component';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, NavComponent],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
	users = signal<User[]>([]);
	title = 'stepbook-app';
	private http = inject(HttpClient);

	getUsers() {
		this.http
			.get<User[]>('https://localhost:7035/api/users?gender=male')
			.subscribe((data) => {
				this.users = signal(data);
			});
	}

	ngOnInit(): void {
		this.getUsers();
	}
}

export interface User {
	Id: number;
	Username: string;
	Age: number;
	KnownAs: string;
	Created: string;
	LastActive: string;
	Gender: string;
	City: string;
	Country: string;
	Photos: any[];
}
