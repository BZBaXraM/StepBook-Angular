import { Component } from '@angular/core';
import { Register } from '../types/register.model';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'app-register',
	standalone: true,
	imports: [FormsModule, MatInputModule, MatSelectModule, MatButtonModule],
	templateUrl: './register.component.html',
	styleUrl: './register.component.css',
})
export class RegisterComponent {
	model: Register = {
		Email: '',
		Username: '',
		KnownAs: '',
		Gender: 'Male' || 'Female',
		DateOfBirth: '',
		City: '',
		Country: '',
		Password: '',
	};

	register() {
		console.log(this.model);
	}

	cancel() {
		console.log('cancelled');
	}
}
