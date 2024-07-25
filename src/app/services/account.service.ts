import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { map } from 'rxjs';
import { Register } from '../models/register.model';
import { Login } from '../models/login.model';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class AccountService {
	private baseUrl = environment.apiUrl;
	private http = inject(HttpClient);
	public currentUser = signal<User | null>(null);

	login(model: Login) {
		return this.http.post<User>(this.baseUrl + 'Account/login', model).pipe(
			map((user) => {
				if (user) {
					this.setCurrentUser(user);
				}
			})
		);
	}

	register(model: Register) {
		return this.http.post<User>(this.baseUrl + 'Account/register', model).pipe(
			map((user) => {
				if (user) {
					this.setCurrentUser(user);
				}
				return user;
			})
		);
	}

	confirmEmail(token: string, email: string) {
		return this.http.get(this.baseUrl + 'confirm-email', {
			params: { token, email },
		});
	}

	logout() {
		localStorage.removeItem('user');
		this.currentUser.set(null);
	}
	setCurrentUser(user: User) {
		localStorage.setItem('user', JSON.stringify(user));
		this.currentUser.set(user);
	}
}

export { Login, Register };
