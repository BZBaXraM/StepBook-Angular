import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import {
	HubConnection,
	HubConnectionBuilder,
	HubConnectionState,
} from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { User } from '../models/user.model';
import { take } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root',
})
export class PresenceService {
	hubUrl = environment.hubsUrl;
	private connection!: HubConnection;
	private router = inject(Router);
	private toastr = inject(ToastrService);
	onlineUsers = signal<string[]>([]);

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
}
