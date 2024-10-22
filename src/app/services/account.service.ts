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
import { PresenceService } from './presence.service';
import { ChangeUsername } from '../models/change-username.model';
import { ConfirmCode } from '../models/confirm-code.model';

@Injectable({
	providedIn: 'root',
})
export class AccountService {
	private baseUrl = environment.apiUrl;
	private http = inject(HttpClient);
	private likeService = inject(LikesService);
	public currentUser = signal<User | null>(null);
	private presenceService = inject(PresenceService);

	login(model: Login) {
		return this.http.post<User>(this.baseUrl + 'Account/login', model).pipe(
			map((user) => {
				if (user) {
					this.setCurrentUser(user);
				}
			})
		);
	}

	register(model: Register): Observable<string> {
		return this.http.post(this.baseUrl + 'Account/register', model, {
			responseType: 'text',
		});
	}

	confirmEmailCode(model: ConfirmCode): Observable<string> {
		return this.http.post(
			this.baseUrl + 'Account/confirm-email-code',
			model,
			{
				responseType: 'text',
			}
		);
	}

	isLoggedIn() {
		return !!localStorage.getItem('user');
	}

	logout() {
		localStorage.removeItem('user');
		localStorage.removeItem('token');
		this.currentUser.set(null);
	}

	setCurrentUser(user: User) {
		const token = user.token || user.Token || user.accessToken;
		localStorage.setItem('token', token);
		this.currentUser.set(user);
		this.likeService.getLikeIds();
		this.presenceService.createConnection(user);
	}

	forgetPassword(model: ForgetPassword) {
		return this.http.post(this.baseUrl + 'Account/forget-password', model, {
			responseType: 'text',
		});
	}

	resetPassword(model: ResetPassword) {
		return this.http.post(this.baseUrl + 'Account/reset-password', model, {
			responseType: 'text',
		});
	}

	deleteAccount() {
		return this.http.delete(this.baseUrl + 'Account/delete-account', {});
	}

	changePassword(model: ChangePassword) {
		return this.http.put(this.baseUrl + 'Account/change-password', model, {
			responseType: 'text',
		});
	}

	changeUsername(model: ChangeUsername) {
		return this.http.put(this.baseUrl + 'Account/change-username', model, {
			responseType: 'text',
		});
	}
}

export { Login, Register };
