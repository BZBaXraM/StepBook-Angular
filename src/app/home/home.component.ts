import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RegisterComponent } from '../register/register.component';
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
export class HomeComponent {
	registerMode = false;
	// users = signal<Member[]>([]);

	registerToggle() {
		this.registerMode = !this.registerMode;
	}

	cancelRegisterMode(event: boolean) {
		this.registerMode = event;
	}
}
