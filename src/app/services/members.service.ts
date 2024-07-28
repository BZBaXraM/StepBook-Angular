import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Member} from '../models/member.model';

@Injectable({
	providedIn: 'root',
})
export class MembersService {
	private http = inject(HttpClient);
	baseUrl = environment.apiUrl;
	// baseUrl = 'https://localhost:7035/api/';

	getMembers() {
		return this.http.get<Member[]>(
			this.baseUrl + 'Users?Gender=male',
		);
	}

	getMember(username: string) {
		return this.http.get<Member>(
			this.baseUrl + 'Users/' + username,
		);
	}

	updateMember(member: Member) {
		return this.http.put(
			this.baseUrl + 'Users',
			member,
		);
	}

}
