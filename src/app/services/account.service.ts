import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../types/user.model';
import { Login } from '../types/login.model';
import { Register } from '../types/register.model';
import { map } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class AccountService {
	baseUrl = 'https://localhost:7035/api/account/';
	private http = inject(HttpClient);
	currentUser = signal<User | null>(null);

	login(model: Login) {
		return this.http
			.post<User>(this.baseUrl + 'login', {
				UsernameOrEmail: model.UsernameOrEmail,
				Password: model.Password,
			})
			.pipe(
				map((user) => {
					if (user) {
						localStorage.setItem('user', JSON.stringify(user));
						this.currentUser.set(user);
					}
				})
			);
	}

	logout() {
		localStorage.removeItem('user');
		this.currentUser.set(null);
	}

	register(model: Register) {
		return this.http.post(this.baseUrl + 'register', {
			Email: model.Email,
			Username: model.Username,
			KnownAs: model.KnownAs,
			Gender: model.Gender,
			DateOfBirth: model.DateOfBirth,
			City: model.City,
			Country: model.Country,
			Password: model.Password,
		});
	}
}

export { Login, Register };
