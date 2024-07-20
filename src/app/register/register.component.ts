import { Component } from '@angular/core';
import { Register } from '../types/register.model';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'app-register',
	standalone: true,
	imports: [FormsModule],
	templateUrl: './register.component.html',
	styleUrl: './register.component.css',
})
export class RegisterComponent {
	model: Register = {
		Email: '',
		Username: '',
		KnownAs: '',
		Gender: '',
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
