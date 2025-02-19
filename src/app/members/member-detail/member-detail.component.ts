import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Member} from '../../models/member.model';
import {TabDirective, TabsetComponent, TabsModule} from 'ngx-bootstrap/tabs';
import {GalleryItem, GalleryModule, ImageItem} from 'ng-gallery';
import {TimeagoModule} from 'ngx-timeago';
import {DatePipe} from '@angular/common';
import {MemberMessagesComponent} from '../member-messages/member-messages.component';
import {MessageService} from '../../services/message.service';
import {PresenceService} from '../../services/presence.service';
import {AccountService} from '../../services/account.service';
import {HubConnectionState} from '@microsoft/signalr';

@Component({
	selector: 'app-member-detail',
	standalone: true,
	imports: [
		TabsModule,
		GalleryModule,
		TimeagoModule,
		DatePipe,
		MemberMessagesComponent,
	],
	templateUrl: './member-detail.component.html',
	styleUrl: './member-detail.component.css',
})
export class MemberDetailComponent implements OnInit, OnDestroy {
	@ViewChild('memberTabs', {static: true}) memberTabs?: TabsetComponent;
	presenceService = inject(PresenceService);
	private route = inject(ActivatedRoute);
	private router = inject(Router);
	private messageService = inject(MessageService);
	private accountService = inject(AccountService);
	member: Member = {} as Member;
	images: GalleryItem[] = [];
	activeTab?: TabDirective;

	ngOnInit(): void {
		this.route.data.subscribe({
			next: (data) => {
				this.member = data['member'];
				this.member &&
				this.member.Photos?.map((photo) => {
					this.images.push(
						new ImageItem({
							src: photo.Url,
							thumb: photo.Url,
						})
					);
				});
			},
		});

		this.route.paramMap.subscribe({
			next: () => this.onRouteParamsChange(),
		});

		this.route.queryParams.subscribe({
			next: (params) => {
				params['tab'] && this.selectTab(params['tab']);
			},
		});
	}

	selectTab(heading: string) {
		if (this.memberTabs) {
			const tab = this.memberTabs.tabs.find((t) => t.heading === heading);
			if (tab) tab.active = true;
		}
	}

	async onRouteParamsChange() {
		const user = this.accountService.currentUser();
		if (!user) return;
		if (
			this.messageService.hubConnection?.state ===
			HubConnectionState.Connected &&
			this.activeTab?.heading === 'Messages'
		) {
			this.messageService.hubConnection?.stop().then(() => {
				this.messageService.createHubConnection(
					user,
					this.member.Username
				);
			});
		}
	}

	async onTabActivated(data: TabDirective) {
		this.activeTab = data;
		await this.router.navigate([], {
			relativeTo: this.route,
			queryParams: {tab: this.activeTab.heading},
			queryParamsHandling: 'merge',
		});
		if (this.activeTab.heading === 'Messages' && this.member) {
			const user = this.accountService.currentUser();
			if (!user) return;
			await this.messageService.createHubConnection(user, this.member.Username);
		} else {
			this.messageService.stopHubConnection();
		}
	}

	ngOnDestroy(): void {
		this.messageService.stopHubConnection();
	}
}
