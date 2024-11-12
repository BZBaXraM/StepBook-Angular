import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { from, map, Observable, switchMap, tap } from 'rxjs';
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
import type { Token } from '../models/token.model';
import CryptoJS from 'crypto-js';

@Injectable({
	providedIn: 'root',
})
export class AccountService {
	private baseUrl = environment.apiUrl;
	private http = inject(HttpClient);
	private likeService = inject(LikesService);
	public currentUser = signal<User | null>(null);
	private presenceService = inject(PresenceService);
	roles = computed(() => {
		const user = this.currentUser();
		const token = user?.token || user?.Token || user?.accessToken;
		if (user && token) {
			try {
				const role = JSON.parse(atob(token.split('.')[1])).Role;
				console.log('Roles:', role);
				return Array.isArray(role) ? role : [role];
			} catch (error) {
				console.log("Error parsing token's roles:", error);
				return [];
			}
		}
		return [];
	});

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
		return (
			!!localStorage.getItem('user') && !!localStorage.getItem('token')
		);
	}

	logout() {
		const token = localStorage.getItem('token');
		const user = localStorage.getItem('user');
		if (token && user) {
			const payload: Partial<Token> = { Token: token };

			this.http
				.post(`${this.baseUrl}Account/logout`, payload, {
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
					responseType: 'text',
				})
				.subscribe({
					next: () => {
						this.clearLocalSession();
						this.presenceService.stopHubConnection();
						this.currentUser.set(null);
					},
					error: (error) => {
						console.error('Error during logout:', error);
						this.clearLocalSession();
					},
				});
		} else {
			this.clearLocalSession();
		}
	}

	private clearLocalSession() {
		localStorage.removeItem('user');
		localStorage.removeItem('token');
		this.currentUser.set(null);
	}

	setCurrentUser(user: User) {
		localStorage.setItem('user', JSON.stringify(user));
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

	getEncryptionKey(): Observable<string> {
		return this.http
			.get<string>(`${this.baseUrl}Account/get-encryption-key`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
					responseType: 'text',
				},
			})
			.pipe(
				tap((response) => {
					console.log('Encryption key response:', response);
				})
			);
	}

	decryptMessage(encryptedMessage: string): Observable<string> {
		return this.getEncryptionKey().pipe(
			switchMap((key) => {
				const decryptedMessage = CryptoJS.AES.decrypt(
					encryptedMessage,
					key
				).toString(CryptoJS.enc.Utf8);
				return from([decryptedMessage]);
			})
		);
	}
}

export { Login, Register };
