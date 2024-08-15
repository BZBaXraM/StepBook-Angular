import { Component, inject, input, output, ViewChild } from '@angular/core';
import { Message } from '../../models/message.model';
import { MessageService } from '../../message.service';
import { TimeagoModule } from 'ngx-timeago';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
	selector: 'app-member-messages',
	standalone: true,
	imports: [TimeagoModule, FormsModule],
	templateUrl: './member-messages.component.html',
	styleUrl: './member-messages.component.css',
})
export class MemberMessagesComponent {
	@ViewChild('messageForm') messageForm?: NgForm;
	username = input.required<string>();
	private messageService = inject(MessageService);
	messages = input.required<Message[]>();
	content = '';
	updatedMessages = output<Message>();

	sendMessage() {
		this.messageService
			.sendMessage(this.username(), this.content)
			.subscribe({
				next: (message) => {
					this.updatedMessages.emit(message);
					this.messageForm?.reset();
				},
			});
	}
}
