import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaginatedResult } from './models/pagination.model';
import { Message } from './models/message.model';
import {
	setPaginatedResponse,
	setPaginationHeaders,
} from '../../_helpers/paginationHelper';

@Injectable({
	providedIn: 'root',
})
export class MessageService {
	baseUrl = environment.apiUrl;
	private http = inject(HttpClient);
	paginatedResult = signal<PaginatedResult<Message[]> | null>(null);

	getMessages(pageNumber: number, pageSize: number, container: string) {
		let params = setPaginationHeaders(pageNumber, pageSize);

		params = params.append('Container', container);

		return this.http
			.get<Message[]>(this.baseUrl + 'Messages', {
				observe: 'response',
				params,
			})
			.subscribe({
				next: (response) =>
					setPaginatedResponse(response, this.paginatedResult),
			});
	}

	deleteMessage(id: number) {
		return this.http.delete(this.baseUrl + 'Messages/' + id);
	}

	getMessageThread(username: string) {
		return this.http.get<Message[]>(
			this.baseUrl + 'Messages/thread/' + username
		);
	}

	sendMessage(username: string, content: string) {
		return this.http.post<Message>(this.baseUrl + 'Messages', {
			RecipientUsername: username,
			content,
		});
	}
}
