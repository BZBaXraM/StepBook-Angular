import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import {
	HttpClient,
	HubConnection,
	HubConnectionBuilder,
	HubConnectionState,
} from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { User } from '../models/user.model';
import { Subject, take } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from './message.service';

@Injectable({
	providedIn: 'root',
})
export class PresenceService {
	baseUrl = environment.apiUrl;
	hubUrl = environment.hubsUrl;
	private connection!: HubConnection;
	private router = inject(Router);
	private toastr = inject(ToastrService);
	private messageService = inject(MessageService);
	onlineUsers = signal<string[]>([]);
	count = 0;
	haveMessages = false;
	newMessagesCount = 0;

	private eventSubject = new Subject<any>();

	eventObservable$ = this.eventSubject.asObservable();

	triggerEvent(data: any) {
		this.eventSubject.next(data);
	}

	createConnection(user: User) {
		this.connection = new HubConnectionBuilder()
			.withUrl(`${this.hubUrl}presence`, {
				accessTokenFactory: () => user.Token,
			})
			.withAutomaticReconnect()
			.build();

		this.connection.start().catch((error) => {
			this.toastr.error(error);
		});

		this.connection.on('UserIsOnline', (username) => {
			this.onlineUsers.update((users) => [...users, username]);
		});

		this.connection.on('UserIsOffline', (username) => {
			this.onlineUsers.update((users) =>
				users.filter((x) => x !== username)
			);
		});

		this.connection.on('GetOnlineUsers', (usernames) => {
			this.onlineUsers.set(usernames);
		});

		this.connection.on('NewMessageReceived', ({ username, knownAs }) => {
			// // this.messageService.getNewMessagesCount().subscribe((count) => {
			// 	this.newMessagesCount = count;

			// // 	this.haveMessages = count > 0;
			// // });
			this.triggerEvent({ message: 'Hello from Component A!' });
			this.toastr
				.info('You have a new message from ' + knownAs)
				.onTap.pipe(take(1))
				.subscribe(() =>
					this.router.navigateByUrl(
						'/members/' + username + '?tab=Messages'
					)
				);


		});
	}

	stopHubConnection() {
		if (this.connection?.state === HubConnectionState.Connected) {
			this.connection.stop().catch((error) => {
				console.log(error);
			});
		}
	}

	// getNewMessagesCount(): void {
	// 	this.messageService.getNewMessagesCount().subscribe((count) => {
	// 		this.newMessagesCount = count;
	// 		this.haveMessages = count > 0;
	// 	});
	// }
}
