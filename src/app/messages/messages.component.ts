import { Component, inject, OnInit } from '@angular/core';
import { MessageService } from '../message.service';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';
import { TimeagoModule } from 'ngx-timeago';
import { Message } from '../models/message.model';
import { RouterLink } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
	selector: 'app-messages',
	standalone: true,
	imports: [ButtonsModule, FormsModule, TimeagoModule, RouterLink, PaginationModule],
	templateUrl: './messages.component.html',
	styleUrl: './messages.component.css',
})
export class MessagesComponent implements OnInit {
	messageService = inject(MessageService);
	container = 'Inbox';
	pageNumber = 1;
	pageSize = 5;

	ngOnInit(): void {
		this.getMessages();
	}

	getMessages() {
		this.messageService.getMessages(
			this.pageNumber,
			this.pageSize,
			this.container
		);
	}

	pageChanged(event: any) {
		if (this.pageNumber !== event.page) {
			this.pageNumber = event.page;
			this.getMessages();
		}
	}

	getRoute(message: Message) {
		if (this.container === 'Outbox') {
			return `/members/${message.RecipientUsername}`;
		} else {
			return `/members/${message.SenderUsername}`;
		}
	}
}
