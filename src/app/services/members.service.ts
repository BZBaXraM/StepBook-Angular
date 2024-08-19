import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../models/member.model';
import { of, tap } from 'rxjs';
import { Photo } from '../models/photo.model';
import { PaginatedResult } from '../models/pagination.model';
import { UserParams } from '../models/userParams';
import { AccountService } from './account.service';
import {
	setPaginatedResponse,
	setPaginationHeaders,
} from '../../../_helpers/paginationHelper';

@Injectable({
	providedIn: 'root',
})
export class MembersService {
	private http = inject(HttpClient);
	baseUrl = environment.apiUrl;
	paginatedResult = signal<PaginatedResult<Member[]> | null>(null);
	private accountService = inject(AccountService);
	user = this.accountService.currentUser();
	memberCache = new Map();
	userParams = signal<UserParams>(new UserParams(this.user));
	members = signal<Member[]>([]);

	resetUserParams() {
		this.userParams.set(new UserParams(this.user));
	}

	getMembers() {
		const response = this.memberCache.get(
			Object.values(this.userParams()).join('-')
		);

		if (response) {
			setPaginatedResponse(response, this.paginatedResult);
		}

		let params = setPaginationHeaders(
			this.userParams().pageNumber,
			this.userParams().pageSize
		);

		params = params.append('MinAge', this.userParams().minAge);
		params = params.append('MaxAge', this.userParams().maxAge);
		params = params.append('Gender', this.userParams().gender);
		params = params.append('OrderBy', this.userParams().orderBy);

		return this.http
			.get<Member[]>(this.baseUrl + 'Users', {
				observe: 'response',
				params,
			})
			.subscribe({
				next: (response) => {
					setPaginatedResponse(response, this.paginatedResult);
					this.memberCache.set(
						Object.values(this.userParams()).join('-'),
						response
					);
				},
			});
	}

	getMember(username: string) {
		const member: Member = [...this.memberCache.values()]
			.reduce((arr, elem) => arr.concat(elem.items), [])
			.find((member: Member) => member?.username === username);

		if (member) {
			return of(member);
		}

		return this.http.get<Member>(this.baseUrl + 'Users/' + username);
	}

	updateMember(member: Member) {
		return this.http.put(this.baseUrl + 'Users', member).pipe(
			tap(() => {
				this.members.update((members) =>
					members.map((x) =>
						x.username === member.username ? member : x
					)
				);
			})
		);
	}

	setMainPhoto(photo: Photo) {
		return this.http
			.put(this.baseUrl + 'Users/set-main-photo/' + photo.id, {})
			.pipe(
				tap(() => {
					this.members.update((members) =>
						members.map((x) => {
							if (x.photos.includes(photo)) {
								x.photoUrl = photo.url;
							}
							return x;
						})
					);
				})
			);
	}

	deletePhoto(photo: Photo) {
		return this.http
			.delete(this.baseUrl + 'Users/delete-photo/' + photo.id)
			.pipe(
				tap(() => {
					this.members.update((members) =>
						members.map((x) => {
							x.photos = x.photos.filter(
								(x) => x.id !== photo.id
							);
							return x;
						})
					);
				})
			);
	}
}
