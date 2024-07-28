import {HttpClient} from '@angular/common/http';
import {inject, Injectable, signal} from '@angular/core';
import {environment} from '../../environments/environment';
import {Member} from '../models/member.model';
import {of, tap} from "rxjs";
import {Photo} from "../models/photo.model";

@Injectable({
	providedIn: 'root',
})
export class MembersService {
	private http = inject(HttpClient);
	baseUrl = environment.apiUrl;
	members = signal<Member[]>([]);

	getMembers() {
		return this.http.get<Member[]>(
			this.baseUrl + 'Users?Gender=male',
		).subscribe({
			next: members => this.members.set(members),
		});
	}

	getMember(username: string) {
		const member = this.members().find(x => x.Username === username);
		if (member !== undefined) {
			return of(member);
		}
		return this.http.get<Member>(
			this.baseUrl + 'Users/' + username,
		);
	}

	updateMember(member: Member) {
		return this.http.put(
			this.baseUrl + 'Users',
			member,
		).pipe(
			tap(() => {
				this.members.update(members =>
					members.map(x =>
						x.Username === member.Username
							? member : x));
			})
		);
	}

	setMainPhoto(photo: Photo) {
		return this.http.put(
			this.baseUrl + 'Users/set-main-photo/' + photo.Id, {}).pipe(
			tap(() => {
				this.members.update(members => members.map(x => {
						if (x.Photos.includes(photo)) {
							x.PhotoUrl = photo.Url
						}
						return x;
					})
				)
			})
		);
	}

	deletePhoto(photo: Photo) {
		return this.http.delete(
			this.baseUrl + 'Users/delete-photo/' + photo.Id,
		).pipe(
			tap(() => {
				this.members.update(members =>
					members.map(x => {
						x.Photos = x.Photos.filter(
							x => x.Id !== photo.Id);
						return x;
					})
				);
			})
		);
	}

}
