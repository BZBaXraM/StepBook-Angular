import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaginatedResult } from './models/pagination.model';
import { Message } from './models/message.model';
import {
	setPaginatedResponse,
	setPaginationHeaders,
} from '../../_helpers/paginationHelper';
import {
	HubConnection,
	HubConnectionBuilder,
	HubConnectionState,
} from '@microsoft/signalr';
import { User } from './models/user.model';

@Injectable({
	providedIn: 'root',
})
export class MessageService {
	baseUrl = environment.apiUrl;
	hubUrl = environment.hubsUrl;
	private http = inject(HttpClient);
	private hubConnection?: HubConnection;
	paginatedResult = signal<PaginatedResult<Message[]> | null>(null);
	messageThread = signal<Message[]>([]);

	createHubConnection(user: User, other: string) {
		this.hubConnection = new HubConnectionBuilder()
			.withUrl(this.hubUrl + 'message?user=' + other, {
				accessTokenFactory: () => user.Token,
			})
			.withAutomaticReconnect()
			.build();

		this.hubConnection.start().catch((error) => console.log(error));

		this.hubConnection.on('ReceiveMessageThread', (messages) => {
			this.messageThread.set(messages);
		});

		this.hubConnection.on('NewMessage', (message) => {
			this.messageThread.update((messages) => [...message, message]);
		});
	}

	stopHubConnection() {
		if (this.hubConnection?.state === HubConnectionState.Connected) {
			this.hubConnection.stop().catch((error) => console.log(error));
		}
	}

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

	async sendMessage(username: string, content: string) {
		return this.hubConnection?.invoke('SendMessage', {
			recipientUsername: username,
			content,
		});
	}
}
