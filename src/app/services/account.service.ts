import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { map, Observable } from 'rxjs';
import { Register } from '../models/register.model';
import { Login } from '../models/login.model';
import { environment } from '../../environments/environment';
import { ResetPassword } from '../models/reset-password.model';
import { ForgetPassword } from '../models/forget.password.model';
import { ChangePassword } from '../models/change-password.model';
import { LikesService } from './likes.service';

@Injectable({
	providedIn: 'root',
})
export class AccountService {
	private baseUrl = environment.apiUrl;
	private http = inject(HttpClient);
	private likeService = inject(LikesService);
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

	register(model: Register): Observable<string | User> {
		return this.http.post(this.baseUrl + 'Account/register', model, {
			responseType: 'text',
		});
	}

	logout() {
		localStorage.removeItem('user');
		this.currentUser.set(null);
	}

	setCurrentUser(user: User) {
		localStorage.setItem('user', JSON.stringify(user));
		this.currentUser.set(user);
		this.likeService.getLikeIds();
	}

	forgetPassword(model: ForgetPassword) {
		console.log('forgetPassword service called with model:', model);
		return this.http.post('Account/forget-password', model, {
			responseType: 'text',
		});
	}

	resetPassword(model: ResetPassword) {
		return this.http.post(this.baseUrl + 'Account/reset-password', model, {
			responseType: 'text',
		});
	}

	sigInWithGoogle() {
		return this.http.get(this.baseUrl + 'Account/signin-google', {});
	}

	loginWithGoogle() {
		return this.http.get(this.baseUrl + 'Account/login-google', {});
	}

	deleteAccount() {
		return this.http.delete(this.baseUrl + 'Account/delete-account', {});
	}

	changePassword(model: ChangePassword) {
		return this.http.post(this.baseUrl + 'Account/change-password', model, {
			responseType: 'text',
		});
	}
}

export { Login, Register };
