import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PaginatedResult } from '../models/pagination.model';
import { Message } from '../models/message.model';
import {
	setPaginatedResponse,
	setPaginationHeaders,
} from '../../helpers/paginationHelper';
import {
	HubConnection,
	HubConnectionBuilder,
	HubConnectionState,
	LogLevel,
} from '@microsoft/signalr';
import { User } from '../models/user.model';
import { Group } from '../models/group.model';
import { BusyService } from './busy.service';
import { AccountService } from './account.service';
import { forkJoin, from, Observable, of, pipe, throwError } from 'rxjs';
import {
	catchError,
	map,
	mergeMap,
	switchMap,
	tap,
	toArray,
} from 'rxjs/operators';
import { enc, AES } from 'crypto-js';

@Injectable({
	providedIn: 'root',
})
export class MessageService {
	baseUrl = environment.apiUrl;
	hubUrl = environment.hubsUrl;
	private http = inject(HttpClient);
	private busyService = inject(BusyService);
	private accountService = inject(AccountService);
	hubConnection?: HubConnection;
	paginatedResult = signal<PaginatedResult<Message[]> | null>(null);
	messageThread = signal<Message[]>([]);

	async createHubConnection(user: User, otherUsername: string) {
		this.busyService.busy();
		this.hubConnection = new HubConnectionBuilder()
			.withUrl(this.hubUrl + 'message?user=' + otherUsername, {
				accessTokenFactory: () => user.Token,
				logger: LogLevel.None,
			})
			.withAutomaticReconnect()
			.build();

		this.hubConnection
			.start()
			.catch((error) => console.log(error))
			.finally(() => this.busyService.idle());

		this.hubConnection.on('ReceiveMessageThread', (messages: Message[]) => {
			console.log('Received messages:', messages);
			from(messages)
				.pipe(
					mergeMap((message) => {
						console.log('Processing message:', message);
						if (message.content === null) {
							return of({ ...message });
						}
						return this.decryptMessage(message.content).pipe(
							map((decryptedContent) => ({
								...message,
								content: decryptedContent,
							})),
							catchError((error) => {
								console.error(
									`Error decrypting message with ID ${message.id}:`,
									error
								);
								return of({
									...message,
									content: 'Invalid input for decryption',
								});
							})
						);
					}),
					toArray(),
					map((decryptedMessages) => {
						console.log('Decrypted messages:', decryptedMessages);
						return decryptedMessages.filter(
							(message) =>
								message.content !==
								'Invalid input for decryption'
						);
					})
				)
				.subscribe({
					next: (validMessages) => {
						console.log('Final valid messages:', validMessages);
						this.messageThread.set(validMessages);
					},
					error: (error) => {
						console.error('Failed to process messages:', error);
					},
				});
		});

		this.hubConnection.on('NewMessage', (message: Message) => {
			console.log('New message received:', message);
			if (message.content === null) {
				this.messageThread.update((messages) => [...messages, message]);
				return;
			}

			this.decryptMessage(message.content).subscribe({
				next: (decryptedContent) => {
					message.content = decryptedContent;
					console.log('Decrypted new message:', message);
					this.messageThread.update((messages) => [
						...messages,
						message,
					]);
				},
				error: (error) => {
					console.error('Failed to decrypt new message:', error);
				},
			});
		});

		this.hubConnection.on('UpdatedGroup', (group: Group) => {
			if (group.connections.some((x) => x.username === otherUsername)) {
				this.messageThread.update((messages) => {
					messages.forEach((message) => {
						if (!message.dateRead) {
							message.dateRead = new Date(Date.now());
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

	// decryptMessage(
	// 	encryptedMessage: string,
	// 	nonce: string
	// ): Observable<string> {
	// 	return this.accountService.getEncryptionKey().pipe(
	// 		switchMap((key: string) => {
	// 			const decodedKey = CryptoJS.enc.Base64.parse(key);
	// 			const decodedNonce = CryptoJS.enc.Base64.parse(nonce);
	// 			const decryptedMessage = CryptoJS.AES.decrypt(
	// 				encryptedMessage,
	// 				decodedKey,
	// 				{ iv: decodedNonce }
	// 			).toString(CryptoJS.enc.Utf8);

	// 			if (!decryptedMessage) {
	// 				throw new Error('Decryption resulted in an empty string');
	// 			}

	// 			return of(decryptedMessage);
	// 		}),
	// 		catchError((error) => {
	// 			console.error('Decryption failed:', error);
	// 			return of('Decryption failed');
	// 		})
	// 	);
	// }

	decryptMessage(encryptedMessage: string): Observable<string> {
		return this.accountService.getEncryptionKey().pipe(
			tap((key) => console.log('Encryption key:', key)),
			switchMap((key) => {
				try {
					const decryptedMessage = CryptoJS.AES.decrypt(
						encryptedMessage,
						CryptoJS.enc.Utf8.parse(key)
					).toString(CryptoJS.enc.Utf8);
					if (!decryptedMessage)
						throw new Error('Empty decrypted message');
					return from([decryptedMessage]);
				} catch (error) {
					console.error('Decryption failed:', error);
					throw error;
				}
			}),
			catchError((error) => {
				console.error('Error in decryptMessage:', error);
				return throwError(() => new Error('Failed to decrypt message'));
			})
		);
	}

	async sendMessage(username: string, content: string, fileUrl?: string) {
		try {
			return await this.hubConnection?.invoke('SendMessage', {
				recipientUsername: username,
				content,
				fileUrl,
			});
		} catch (error) {
			console.error('Failed to send message:', error);
			throw error;
		}
	}

	deleteMessage(id: number) {
		return this.http.delete(this.baseUrl + 'messages/' + id);
	}

	removeMessage(id: number) {
		this.messageThread.update((messages) =>
			messages.filter((m) => m.id !== id)
		);
	}

	getNewMessagesCount() {
		return this.http.get<number>(
			this.baseUrl + 'messages/new-messages-count'
		);
	}
}
