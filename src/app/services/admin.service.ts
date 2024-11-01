import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class AdminService {
	private baseUrl = environment.apiUrl;
	private http = inject(HttpClient);

	addToBlackList(username: string) {
		return this.http.post(
			this.baseUrl + `Admin/add-to-blacklist/${username}`,
			{}
		);
	}

	removeFromBlackList(username: string) {
		return this.http.post(this.baseUrl + 'Admin/remove-from-black-list', {
			username,
		});
	}

	getBlackList() {
		return this.http.get<string[]>(this.baseUrl + 'Admin/blacklist');
	}

	getReports() {
		return this.http.get(this.baseUrl + 'Admin/reports');
	}

	deleteUserAccount(username: string) {
		return this.http.post(this.baseUrl + 'Admin/delete-user-account', {
			username,
		});
	}

	getUsers() {
		return this.http.get(this.baseUrl + 'Admin/users');
	}
}
