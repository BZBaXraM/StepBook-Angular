import {HttpClient} from '@angular/common/http';
import {inject, Injectable, signal} from '@angular/core';
import {User} from '../types/user.model';
import {catchError, map} from 'rxjs';
import {Register} from "../types/register.model";
import {Login} from "../types/login.model";

@Injectable({
	providedIn: 'root',
})
export class AccountService {
	private baseUrl = 'https://localhost:7035/api/Account/';
	private http = inject(HttpClient);
	public currentUser = signal<User | null>(null);

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
				}),
				catchError((error) => {
						return error;
					}
				)
			);
	}

	logout() {
		localStorage.removeItem('user');
		this.currentUser.set(null);
	}

	// register(model: Register) {
	// 	return this.http
	// 		.post<User>(this.baseUrl + 'register', model)
	// 		.pipe(
	// 			map((user) => {
	// 				if (user) {
	// 					localStorage.setItem('user', JSON.stringify(user));
	// 					this.currentUser.set(user);
	// 				}
	// 				return user;
	// 			}));
	// }

	// In AccountService
	register(model: Register) {
		return this.http.post<User>(this.baseUrl + 'register', model).pipe(
			map((response: any) => {
				if (response.text === 'Registration successful. Please check your email for confirmation link.') {
					localStorage.setItem('user', JSON.stringify(response.user));
					this.currentUser.set(response.user);
					return {success: true, user: response.user};
				}
				throw new Error('Registration failed');
			})
		);
	}


	confirmEmail(token: string, email: string) {
		return this.http.get(this.baseUrl + 'confirm-email', {params: {token, email}});
	}
}

export {Login, Register}
