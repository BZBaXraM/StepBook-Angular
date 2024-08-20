import {
	AfterViewChecked,
	Component,
	inject,
	input,
	OnInit,
	signal,
	ViewChild,
} from '@angular/core';
import { MessageService } from '../../services/message.service';
import { TimeagoModule } from 'ngx-timeago';
import { FormsModule, NgForm } from '@angular/forms';
import { Message } from '../../models/message.model';

@Component({
	selector: 'app-member-messages',
	standalone: true,
	imports: [TimeagoModule, FormsModule],
	templateUrl: './member-messages.component.html',
	styleUrl: './member-messages.component.css',
})
export class MemberMessagesComponent implements AfterViewChecked, OnInit {
	@ViewChild('messageForm') messageForm?: NgForm;
	@ViewChild('scrollMe') scrollMe?: any;
	username = input.required<string>();
	messageService = inject(MessageService);
	content = '';
	messages = signal<Message[]>([]);

	getMessages() {
		this.messageService
			.getMessageThread(this.username())
			.subscribe((messages) => {
				this.messages.set(messages);
			});
	}

	ngOnInit(): void {
		this.getMessages();
	}
	sendMessage() {
		this.messageService
			.sendMessage(this.username(), this.content)
			.then(() => {
				this.messageForm?.reset();
				this.scrollToBottom();
			});
	}

	ngAfterViewChecked(): void {
		this.scrollToBottom();
	}

	private scrollToBottom() {
		if (this.scrollMe) {
			this.scrollMe.nativeElement.scrollTop =
				this.scrollMe.nativeElement.scrollHeight;
		}
	}
}
