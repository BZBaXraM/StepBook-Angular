import {inject, Injectable, signal} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {PaginatedResult} from '../models/pagination.model';
import {Message} from '../models/message.model';
import {
	setPaginatedResponse,
	setPaginationHeaders,
} from '../../../_helpers/paginationHelper';
import {
	HubConnection,
	HubConnectionBuilder,
	HubConnectionState,
} from '@microsoft/signalr';
import {User} from '../models/user.model';
import {Group} from '../models/group.model';
import {BusyService} from './busy.service';

@Injectable({
	providedIn: 'root',
})
export class MessageService {
	baseUrl = environment.apiUrl;
	hubUrl = environment.hubsUrl;
	private http = inject(HttpClient);
	private busyService = inject(BusyService);
	hubConnection?: HubConnection;
	paginatedResult = signal<PaginatedResult<Message[]> | null>(null);
	messageThread = signal<Message[]>([]);

	async createHubConnection(user: User, otherUsername: string) {
		this.busyService.busy();
		this.hubConnection = new HubConnectionBuilder()
			.withUrl(this.hubUrl + 'message?user=' + otherUsername, {
				accessTokenFactory: () => user.Token,
			})
			.withAutomaticReconnect()
			.build();

		this.hubConnection
			.start()
			.catch((error) => console.log(error))
			.finally(() => this.busyService.idle());

		this.hubConnection.on('ReceiveMessageThread', (messages: Message[]) => {
			this.messageThread.set(messages);
		});

		this.hubConnection.on('NewMessage', (message: Message) => {
			this.messageThread.update((messages) => [...messages, message]);
			console.log(message);
		});

		this.hubConnection.on('UpdatedGroup', (group: Group) => {
			if (group.connections.some((x) => x.username === otherUsername)) {
				this.messageThread.update((messages) => {
					messages.forEach((message) => {
						if (!message.DateRead) {
							message.DateRead = new Date(Date.now());
						}
					});
					return messages;
				});
			}
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

	getMessageThread(username: string) {
		return this.http.get<Message[]>(
			this.baseUrl + 'Messages/Thread/' + username
		);
	}

	async sendMessage(username: string, content: string) {
		return this.hubConnection?.invoke('SendMessage', {
			recipientUsername: username,
			content,
		});
	}

	deleteMessage(id: number) {
		return this.http.delete(this.baseUrl + 'messages/' + id);
	}

	getNewMessagesCount() {
		return this.http.get<number>(
			this.baseUrl + 'messages/new-messages-count'
		);
	}
}
