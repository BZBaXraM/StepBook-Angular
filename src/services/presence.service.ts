import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment.development';
import {
	HubConnection,
	HubConnectionBuilder,
	HubConnectionState,
} from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { User } from '../app/models/user.model';

@Injectable({
	providedIn: 'root',
})
export class PresenceService {
	hubUrl = environment.hubsUrl;
	private connection?: HubConnection;
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
			this.toastr.info(username + ' is online');
		});

		this.connection.on('UserIsOffline', (username) => {
			this.toastr.warning(username + ' is offline');
		});

		this.connection.on('GetOnlineUsers', (usernames) => {
			this.onlineUsers.set(usernames);
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
