import {
	AfterViewChecked,
	ChangeDetectorRef,
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
import { AccountService } from '../../services/account.service';
import { AsyncPipe } from '@angular/common';

@Component({
	selector: 'app-member-messages',
	standalone: true,
	imports: [TimeagoModule, FormsModule, AsyncPipe],
	templateUrl: './member-messages.component.html',
	styleUrl: './member-messages.component.css',
})
export class MemberMessagesComponent implements AfterViewChecked, OnInit {
	@ViewChild('messageForm') messageForm?: NgForm;
	@ViewChild('scrollMe') scrollMe?: any;
	username = input.required<string>();
	messageService = inject(MessageService);
	private cdr = inject(ChangeDetectorRef);
	private accountService = inject(AccountService);
	content = '';
	messages = signal<Message[]>([]);

	getMessages() {
		return this.messageService.getMessageThread(this.username()).subscribe({
			next: (messages) => {
				this.messages.set(messages);
				this.cdr.detectChanges();
			},
		});
	}

	ngOnInit(): void {
		const currentUser = this.accountService.currentUser();
		if (currentUser) {
			this.messageService.createHubConnection(
				currentUser,
				this.username()
			);
		} else {
			console.error('User is not logged in');
		}
		this.getMessages();
	}

	sendMessage() {
		this.messageService
			.sendMessage(this.username(), this.content)
			.then(() => {
				this.messages.update((messages) => [
					...messages,
					{
						SenderUsername: this.username(),
						Content: this.content,
						MessageSent: new Date(),
						Id: 0,
						SenderId: 0,
						SenderPhotoUrl: '',
						RecipientId: 0,
						RecipientUsername: '',
						RecipientPhotoUrl: '',
					},
				]);

				this.messageForm?.reset();
				this.cdr.detectChanges();
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
