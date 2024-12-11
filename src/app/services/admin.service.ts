import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ReportDto } from '../models/report.model';
import { BlackListedUsers } from '../models/black-listed-users.model';
import { User } from '../models/user.model';

@Injectable({
	providedIn: 'root',
})
export class AdminService {
	private baseUrl = environment.apiUrl;
	private http = inject(HttpClient);
	reports = signal<ReportDto[]>([]);
	blackListedUsers = signal<BlackListedUsers[]>([]);
	users = signal<User[]>([]);

	addToBlackList(username: string) {
		return this.http.post(
			this.baseUrl + `Admin/add-to-blacklist/${username}`,
			{}
		);
	}

	removeFromBlackList(username: string) {
		return this.http.post(
			this.baseUrl + `Admin/remove-from-blacklist/${username}`,
			{}
		);
	}

	deleteUserAccount(username: string) {
		return this.http.delete(
			this.baseUrl + `Admin/delete-user-account/${username}`
		);
	}

	getBlackList() {
		return this.http
			.get<BlackListedUsers[]>(this.baseUrl + 'Admin/blacklist')
			.subscribe({
				next: (users) => this.blackListedUsers.set(users),
			});
	}

	getReports() {
		return this.http
			.get<ReportDto[]>(this.baseUrl + 'Admin/reports')
			.subscribe({
				next: (reports) => this.reports.set(reports),
			});
	}

	getUsers() {
		return this.http.get<User[]>(this.baseUrl + 'Admin/users').subscribe({
			next: (users) => this.users.set(users),
		});
	}
}
