import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MembersService } from '../../services/members.service';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../models/member.model';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { DatePipe } from '@angular/common';
import { MemberMessagesComponent } from '../member-messages/member-messages.component';
import { Message } from '../../models/message.model';
import { MessageService } from '../../message.service';

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
export class MemberDetailComponent implements OnInit {
	@ViewChild('memberTabs', { static: true }) memberTabs?: TabsetComponent;
	private memberService = inject(MembersService);
	private route = inject(ActivatedRoute);
	private messageService = inject(MessageService);
	member: Member = {} as Member;
	images: GalleryItem[] = [];
	activeTab?: TabDirective;
	messages: Message[] = [];

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

	onUpdateMessages(event: Message) {
		this.messages.push(event);
	}

	onTabActivated(data: TabDirective) {
		this.activeTab = data;

		// Load messages only when the "Messages" tab is activated
		if (
			this.activeTab.heading === 'Messages' &&
			this.messages.length === 0 &&
			this.member
		) {
			this.messageService
				.getMessageThread(this.member.Username)
				.subscribe({
					next: (messages) => (this.messages = messages),
				});
		}
	}

	// getMember() {
	// 	const userName = this.route.snapshot.paramMap.get('Username');
	// 	if (!userName) return;
	// 	this.memberService.getMember(userName).subscribe({
	// 		next: (member) => {
	// 			this.member = member;
	// 			member.Photos?.map((photo) => {
	// 				this.images.push(
	// 					new ImageItem({
	// 						src: photo.Url,
	// 						thumb: photo.Url,
	// 					})
	// 				);
	// 			});
	// 			console.log(this.member.Username);
	// 		},
	// 		error: (error) => {
	// 			console.error(error);
	// 		},
	// 	});
	// }
}
