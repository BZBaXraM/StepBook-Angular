import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RegisterComponent } from "../register/register.component";

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [MatButtonModule, MatIconButton, MatIconModule, RegisterComponent],
	templateUrl: './home.component.html',
	styleUrl: './home.component.css',
})
export class HomeComponent {
	registerMode = false;

	registerToggle() {
		this.registerMode = !this.registerMode;
	}
}
