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
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

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
            const decryptObservables = messages.map((message) =>
                this.accountService.decryptMessage(message.content).pipe(
                    map((decryptedContent) => ({
                        ...message,
                        content: decryptedContent,
                    }))
                )
            );

            forkJoin(decryptObservables).subscribe({
                next: (decryptedMessages) => {
                    const validMessages = decryptedMessages.filter(message => message.content !== null && message.content !== 'Invalid input for decryption');
                    this.messageThread.set(validMessages);
                },
                error: (error) => {
                    if (error instanceof SyntaxError) {
                        console.error('Failed to decrypt messages: Invalid JSON response', error);
                    } else if (error instanceof HttpErrorResponse) {
                        if (error.status === 200 && error.error instanceof ProgressEvent) {
                            console.error('Failed to decrypt messages: Response is not valid JSON', error);
                        } else {
                            console.error('Failed to decrypt messages:', error);
                        }
                    } else {
                        console.error('Failed to decrypt messages:', error);
                    }
                },
            });
        });

        this.hubConnection.on('NewMessage', (message: Message) => {
            this.accountService.decryptMessage(message.content).subscribe({
                next: (decryptedContent) => {
                    message.content = decryptedContent;
                    this.messageThread.update((messages) => [...messages, message]);
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
