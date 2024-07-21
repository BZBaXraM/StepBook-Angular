import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RegisterComponent } from '../register/register.component';
import { Member } from '../types/member.model';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

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
	users = signal<Member[]>([]);
	private http = inject(HttpClient);

	registerToggle() {
		this.registerMode = !this.registerMode;
	}

	cancelRegisterMode(event: boolean) {
		this.registerMode = event;
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
	}
}
