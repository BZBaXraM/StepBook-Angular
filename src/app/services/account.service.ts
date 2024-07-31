import {HttpClient} from '@angular/common/http';
import {inject, Injectable, signal} from '@angular/core';
import {User} from '../models/user.model';
import {map, Observable, tap} from 'rxjs';
import {Register} from '../models/register.model';
import {Login} from '../models/login.model';
import {environment} from '../../environments/environment';
import {ResetPassword} from "../models/reset-password.model";
import {ForgetPasswordModel} from "../models/forget.password.model";

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
		return this.http.post<User>(this.baseUrl + 'Account/register', model, {responseType: 'json'}).pipe(
			map((user) => {
				if (user) {
					this.setCurrentUser(user);
				}
				return user;
			})
		);
	}

	confirmEmail(token: string, email: string) {
		return this.http.get(this.baseUrl + 'Account/confirm-email', {
			params: {token, email},
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

	// account.service.ts
	forgetPassword(model: ForgetPasswordModel) {
		console.log('forgetPassword service called with model:', model);
		return this.http.post('https://localhost:7035/api/Account/forget-password', model, {responseType: 'text'});
	}


	resetPassword(model: ResetPassword) {
		return this.http.post(this.baseUrl + 'Account/reset-password', model, {responseType: 'text'});
	}
}

export {Login, Register};
