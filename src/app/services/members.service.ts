import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable, model, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../models/member.model';
import { of, tap } from 'rxjs';
import { Photo } from '../models/photo.model';
import { PaginatedResult } from '../models/pagination.model';
import { UserParams } from '../models/userParams';
import { AccountService } from './account.service';

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

	resetUserParams() {
		this.userParams.set(new UserParams(this.user));
	}

	getMembers() {
		const response = this.memberCache.get(
			Object.values(this.userParams()).join('-')
		);

		if (response) {
			this.setPaginatedResponse(response);
		}

		let params = this.setPaginationHeaders(
			this.userParams().PageNumber,
			this.userParams().PageSize
		);

		params = params.append('MinAge', this.userParams().MinAge);
		params = params.append('MaxAge', this.userParams().MaxAge);
		params = params.append('Gender', this.userParams().Gender);
		params = params.append('OrderBy', this.userParams().OrderBy);

		return this.http
			.get<Member[]>(this.baseUrl + 'Users', {
				observe: 'response',
				params,
			})
			.subscribe({
				next: (response) => {
					this.setPaginatedResponse(response);
					this.memberCache.set(
						Object.values(this.userParams()).join('-'),
						response
					);
				},
			});
	}

	private setPaginatedResponse(response: HttpResponse<Member[]>) {
		this.paginatedResult.set({
			items: response.body as Member[],
			pagination: JSON.parse(response.headers.get('Pagination')!),
		});
	}

	getMember(username: string) {
		const member: Member = [...this.memberCache.values()]
			.reduce((arr, elem) => arr.concat(elem.items), [])
			.find((member: Member) => member?.Username === username);

		if (member) {
			return of(member);
		}

		return this.http.get<Member>(this.baseUrl + 'Users/' + username);
	}

	updateMember(member: Member) {
		return this.http
			.put(this.baseUrl + 'Users', member)
			.pipe
			// tap(() => {
			// 	this.members.update((members) =>
			// 		members.map((x) =>
			// 			x.Username === member.Username ? member : x
			// 		)
			// 	);
			// })
			();
	}

	setMainPhoto(photo: Photo) {
		return this.http
			.put(this.baseUrl + 'Users/set-main-photo/' + photo.Id, {})
			.pipe
			// tap(() => {
			// 	this.members.update((members) =>
			// 		members.map((x) => {
			// 			if (x.Photos.includes(photo)) {
			// 				x.PhotoUrl = photo.Url;
			// 			}
			// 			return x;
			// 		})
			// 	);
			// })
			();
	}

	deletePhoto(photo: Photo) {
		return this.http
			.delete(this.baseUrl + 'Users/delete-photo/' + photo.Id)
			.pipe
			// tap(() => {
			// 	this.members.update((members) =>
			// 		members.map((x) => {
			// 			x.Photos = x.Photos.filter(
			// 				(x) => x.Id !== photo.Id
			// 			);
			// 			return x;
			// 		})
			// 	);
			// })
			();
	}

	private setPaginationHeaders(pageNumber: number, pageSize: number) {
		let params = new HttpParams();

		if (pageNumber && pageSize) {
			params = params.append('pageNumber', pageNumber);
			params = params.append('pageSize', pageSize);
		}

		return params;
	}
}
